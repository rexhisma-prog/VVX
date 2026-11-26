"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildings } from "@/data/buildings";
import {
  apartmentsOnFloor,
  bedroomsLabel,
  floorLabel,
  formatArea,
  type Apartment,
} from "@/data/apartments";
import { roomArea } from "@/lib/plan/geometry";
import { apartmentHref, inquiryHref } from "@/lib/links";
import FloorPlanSvg from "./FloorPlanSvg";
import UnitPlanSvg from "./UnitPlanSvg";
import { Arrow, StatusBadge, StatusLegend } from "../ui";

interface Props {
  /** buildings the visitor can choose from */
  buildingIds: string[];
  initialBuilding?: string;
  /** keep state in the URL query (?objekti=&kati=&ap=) */
  syncUrl?: boolean;
}

const ZOOMS = [1, 1.4, 1.8, 2.4, 3];


export default function ApartmentExplorer({ buildingIds, initialBuilding, syncUrl = true }: Props) {
  const list = useMemo(() => buildings.filter((b) => buildingIds.includes(b.id)), [buildingIds]);
  const [buildingId, setBuildingId] = useState(initialBuilding ?? list[0].id);
  const building = list.find((b) => b.id === buildingId) ?? list[0];
  const [floor, setFloor] = useState(building.floors[0]);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const floorApts = useMemo(() => apartmentsOnFloor(building.id, floor), [building.id, floor]);
  const current = floorApts.find((a) => a.number === selected) ?? null;

  /* ---------- initial state from URL + mobile zoom ---------- */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const b = list.find((x) => x.id === q.get("objekti")) ?? building;
    const k = Number(q.get("kati"));
    const ap = q.get("ap")?.toUpperCase() ?? null;
    if (b.id !== building.id) setBuildingId(b.id);
    const fl = b.floors.includes(k) ? k : b.floors[0];
    setFloor(fl);
    if (ap && apartmentsOnFloor(b.id, fl).some((a) => a.number === ap)) setSelected(ap);
    if (window.innerWidth < 768) setZoom(3);
    else if (window.innerWidth < 1024) setZoom(1);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!syncUrl || !ready) return;
    const q = new URLSearchParams(window.location.search);
    if (list.length > 1) q.set("objekti", building.id);
    q.set("kati", String(floor));
    if (selected) q.set("ap", selected);
    else q.delete("ap");
    const url = `${window.location.pathname}?${q.toString()}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [building.id, floor, selected, syncUrl, ready, list.length]);

  const chooseBuilding = (id: string) => {
    const b = list.find((x) => x.id === id)!;
    setBuildingId(id);
    setFloor(b.floors[0]);
    setSelected(null);
  };

  const chooseFloor = (f: number) => {
    setFloor(f);
    // keep the same position on the new floor if possible
    if (current) setSelected(`${building.code}-${f}${current.slot.slot}`);
  };

  /* ---------- drag to pan when zoomed (mouse only) ---------- */
  const drag = useRef<{ x: number; y: number; sl: number; st: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || ZOOMS[zoom] === 1) return;
    const el = scrollerRef.current!;
    drag.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true;
    const el = scrollerRef.current!;
    el.scrollLeft = d.sl - dx;
    el.scrollTop = d.st - dy;
  };
  const endDrag = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const onSelect = useCallback((n: string) => {
    if (drag.current?.moved) return;
    setSelected((s) => (s === n ? s : n));
  }, []);

  const availableOn = (f: number) =>
    apartmentsOnFloor(building.id, f).filter((a) => a.status === "available").length;

  const scrollToPanel = () => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative">
      {/* -------- building selector -------- */}
      {list.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Zgjidhni objektin">
          {list.map((b) => {
            const active = b.id === building.id;
            return (
              <button
                key={b.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => chooseBuilding(b.id)}
                className={`border px-5 py-3 text-left transition-colors ${
                  active ? "border-brand bg-brand text-white" : "border-line bg-white text-ink hover:border-brand"
                }`}
              >
                <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] opacity-70">
                  Objekti {b.code}
                </span>
                <span className="display mt-1 block text-xl">{b.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* -------- floor selector -------- */}
      <div className="flex flex-col gap-5 border-b border-line pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow text-muted" id="floor-label">
            Zgjidhni katin
          </p>
          <div
            className="no-scrollbar -mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1"
            role="tablist"
            aria-labelledby="floor-label"
          >
            {[...building.floors].reverse().map((f) => {
              const active = f === floor;
              const free = availableOn(f);
              return (
                <button
                  key={f}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => chooseFloor(f)}
                  className={`min-w-[5.6rem] shrink-0 border px-4 py-2.5 text-left transition-colors ${
                    active ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand"
                  }`}
                >
                  <span className="block text-sm font-semibold">{floorLabel(f)}</span>
                  <span className={`block text-[0.7rem] ${active ? "text-white/70" : "text-muted"}`}>
                    {free} të lira
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <StatusLegend />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 xl:gap-10">
        {/* -------- floor plan -------- */}
        <div className="lg:col-span-8">
          <div className="relative border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-sm">
                <span className="font-semibold">{building.name}</span>
                <span className="text-muted"> · {floorLabel(floor)}</span>
              </p>
              <div className="flex items-center gap-1" aria-label="Zmadhimi i planimetrisë">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0, z - 1))}
                  disabled={zoom === 0}
                  className="flex h-9 w-9 items-center justify-center border border-line text-lg disabled:opacity-30"
                  aria-label="Zvogëlo"
                >
                  −
                </button>
                <span className="w-12 text-center text-xs tabular-nums text-muted">{Math.round(ZOOMS[zoom] * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
                  disabled={zoom === ZOOMS.length - 1}
                  className="flex h-9 w-9 items-center justify-center border border-line text-lg disabled:opacity-30"
                  aria-label="Zmadho"
                >
                  +
                </button>
              </div>
            </div>
            <div
              ref={scrollerRef}
              className={`max-h-[78vh] overflow-auto overscroll-contain ${ZOOMS[zoom] > 1 ? "md:cursor-grab md:active:cursor-grabbing" : ""}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
            >
              <div style={{ width: `${ZOOMS[zoom] * 100}%` }} className="p-2 md:p-4">
                <FloorPlanSvg
                  building={building}
                  apartments={floorApts}
                  selected={selected}
                  hovered={hovered}
                  onSelect={onSelect}
                  onHover={setHovered}
                  id={`ex-${building.id}`}
                />
              </div>
            </div>
            <p className="border-t border-line px-4 py-2.5 text-xs text-muted">
              Klikoni mbi një apartament për të parë detajet.
              <span className="md:hidden"> Rrëshqitni për të lëvizur nëpër planimetri.</span>
            </p>
          </div>

          {/* apartment list for this floor */}
          <div className="mt-8">
            <h3 className="eyebrow text-muted">Apartamentet në katin {floor}</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {floorApts.map((a) => {
                const active = a.number === selected;
                return (
                  <li key={a.number}>
                    <button
                      type="button"
                      onClick={() => setSelected(a.number)}
                      onMouseEnter={() => setHovered(a.number)}
                      onMouseLeave={() => setHovered(null)}
                      aria-pressed={active}
                      className={`grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-3 py-3.5 text-left transition-colors sm:grid-cols-[7rem_1fr_7rem_8.5rem] ${
                        active ? "bg-brand-tint" : "hover:bg-stone"
                      }`}
                    >
                      <span className="font-semibold">{a.number}</span>
                      <span className="text-sm text-muted sm:text-ink">
                        {a.layout.typology} · {bedroomsLabel(a.layout.bedrooms)}
                      </span>
                      <span className="text-sm tabular-nums">{formatArea(a.area)}</span>
                      <StatusBadge status={a.status} className="justify-self-end text-muted sm:justify-self-start" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* -------- selected apartment panel -------- */}
        <div className="lg:col-span-4" ref={panelRef}>
          <div className="scroll-mt-28 lg:sticky lg:top-28">
            {current ? (
              <ApartmentPanel apartment={current} onClose={() => setSelected(null)} />
            ) : (
              <div className="border border-line bg-stone p-8">
                <p className="eyebrow text-brand">Përzgjedhja</p>
                <p className="display mt-4 text-3xl">Zgjidhni një apartament</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  Klikoni mbi një apartament në planimetri ose në listë për të parë sipërfaqen, dhomat,
                  ballkonin dhe planimetrinë e tij individuale.
                </p>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6 text-center">
                  {(["available", "reserved", "sold"] as const).map((s) => (
                    <div key={s}>
                      <dt>
                        <StatusBadge status={s} className="text-[0.6rem] text-muted" />
                      </dt>
                      <dd className="display mt-2 text-3xl">
                        {floorApts.filter((a) => a.status === s).length}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* mobile summary bar */}
      {current && (
        <div className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 bg-brand px-4 py-3 text-white shadow-2xl lg:hidden">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{current.number}</p>
            <p className="truncate text-xs text-white/70">
              {current.layout.typology} · {formatArea(current.area)}
            </p>
          </div>
          <button type="button" onClick={scrollToPanel} className="btn min-h-0 shrink-0 bg-white px-4 py-2 text-brand">
            Detajet
          </button>
        </div>
      )}
    </div>
  );
}

function ApartmentPanel({ apartment: a, onClose }: { apartment: Apartment; onClose: () => void }) {
  const rooms = a.layout.rooms.filter((r) => r.kind !== "balcony");
  return (
    <article className="border border-line bg-white" aria-live="polite">
      <div className="flex items-start justify-between gap-4 border-b border-line p-6">
        <div>
          <StatusBadge status={a.status} className="text-muted" />
          <h3 className="display mt-3 text-[2.6rem] leading-none">{a.number}</h3>
          <p className="mt-2 text-sm text-muted">
            {a.layout.name} · {a.layout.typology}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center border border-line text-muted hover:text-ink"
          aria-label="Mbyll përzgjedhjen"
        >
          ×
        </button>
      </div>

      <dl className="grid grid-cols-3 border-b border-line text-center">
        {[
          ["Kati", String(a.floor)],
          ["Sipërfaqja", `${a.area.toFixed(1).replace(".", ",")} m²`],
          ["Ballkoni", a.balcony ? `${a.balcony.toFixed(1).replace(".", ",")} m²` : "—"],
          ["Dhoma gjumi", String(a.layout.bedrooms)],
          ["Banjo", String(a.layout.bathrooms)],
          ["Tipologjia", a.layout.typology],
        ].map(([k, v], i) => (
          <div key={k} className={`px-2 py-4 ${i % 3 !== 2 ? "border-r border-line" : ""} ${i < 3 ? "border-b border-line" : ""}`}>
            <dt className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">{k}</dt>
            <dd className="mt-1.5 text-base font-semibold">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="border-b border-line bg-stone/60 p-3">
        <UnitPlanSvg apartment={a} id={`panel-${a.number}`} labels="simple" dims={false} north={false} />
      </div>

      <div className="p-6">
        <h4 className="eyebrow text-muted">Dhomat</h4>
        <ul className="mt-3 space-y-1.5 text-sm">
          {rooms.map((r) => (
            <li key={r.id} className="flex justify-between gap-4">
              <span>{r.name}</span>
              <span className="tabular-nums text-muted">{roomArea(r).toFixed(1).replace(".", ",")} m²</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-2">
          <Link href={apartmentHref(a)} className="btn bg-brand text-white hover:bg-brand-soft">
            Shiko apartamentin <Arrow />
          </Link>
          <Link href={inquiryHref(a)} className="btn border-line text-ink hover:border-brand">
            Kërko informacion
          </Link>
        </div>
      </div>
    </article>
  );
}
