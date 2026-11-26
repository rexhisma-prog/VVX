"use client";

import type { Building } from "@/data/buildings";
import type { Apartment } from "@/data/apartments";
import { STATUS_LABEL } from "@/data/apartments";
import { placedUnits, plateDepth } from "@/lib/plan/floor";
import { CoreDrawing, NorthArrow, PlanDefs, ScaleBar, UnitDrawing } from "./PlanParts";

interface Props {
  building: Building;
  apartments: Apartment[];
  selected?: string | null;
  hovered?: string | null;
  onSelect?: (number: string) => void;
  onHover?: (number: string | null) => void;
  id: string;
  className?: string;
  /** compact mode: no furniture, no tags (used for key plans) */
  compact?: boolean;
}

const fmtArea = (n: number) => n.toFixed(1).replace(".", ",");

export default function FloorPlanSvg({
  building,
  apartments,
  selected,
  hovered,
  onSelect,
  onHover,
  id,
  className,
  compact = false,
}: Props) {
  const units = placedUnits(building);
  const W = building.plate.width;
  const D = plateDepth(building);
  const { northDepth, corridor } = building.plate;
  const cy = northDepth;
  const minX = -1.6;
  const minY = -3.4;
  const vbW = W + 3.2;
  const vbH = D + 6.8;
  const bySlot = new Map(apartments.map((a) => [a.slot.slot, a]));
  const interactive = !!onSelect;

  return (
    <svg
      viewBox={`${minX} ${minY} ${vbW} ${vbH}`}
      className={`fp ${className ?? ""}`}
      role="img"
      aria-label={`Planimetria e katit – ${building.name}`}
    >
      <PlanDefs id={id} />

      {/* corridor */}
      <rect x={0} y={cy} width={W} height={corridor} fill="var(--fp-hall)" />
      {!compact && (
        <text
          x={building.core.x + building.core.w / 2}
          y={cy + corridor / 2 + 0.1}
          textAnchor="middle"
          fontSize={0.24}
          className="fp-room-name fp-labels"
        >
          KORRIDORI I PËRBASHKËT
        </text>
      )}
      {/* corridor end walls with windows */}
      {[0, W].map((x) => (
        <g key={x}>
          <rect x={x - 0.15} y={cy - 0.15} width={0.3} height={0.45} className="fp-wall" />
          <rect x={x - 0.15} y={cy + corridor - 0.3} width={0.3} height={0.45} className="fp-wall" />
          <rect x={x - 0.15} y={cy + 0.3} width={0.3} height={corridor - 0.6} className="fp-window-fill" />
        </g>
      ))}

      <CoreDrawing
        x={building.core.x}
        y={cy + corridor}
        w={building.core.w}
        h={building.plate.southDepth}
        id={id}
        labels={!compact}
      />

      {units.map(({ slot, unit }) => {
        const apt = bySlot.get(slot);
        const status = apt?.status ?? "available";
        const isSel = selected === apt?.number;
        const isHov = hovered === apt?.number;
        const tint = (
          <rect
            x={unit.ox}
            y={unit.oy}
            width={unit.w}
            height={unit.h}
            className={`fp-tint fp-tint-${status} ${isSel ? "is-selected" : ""} ${isHov ? "is-hover" : ""}`}
          />
        );
        return (
          <UnitDrawing
            key={slot}
            unit={unit}
            id={id}
            furniture={!compact}
            faintFurniture
            labels="none"
            tint={tint}
          />
        );
      })}

      {/* selection outlines, tags and hit areas on top */}
      {units.map(({ slot, unit }) => {
        const apt = bySlot.get(slot);
        if (!apt) return null;
        const isSel = selected === apt.number;
        const cx = unit.ox + unit.w / 2;
        const cyU = unit.oy + unit.h / 2;
        const label = `Apartamenti ${apt.number}, ${apt.layout.typology}, ${fmtArea(apt.area)} metra katrorë, ${STATUS_LABEL[apt.status]}`;
        return (
          <g
            key={`hit-${slot}`}
            className={`fp-hit ${interactive ? "is-interactive" : ""}`}
            role={interactive ? "button" : undefined}
            tabIndex={interactive ? 0 : undefined}
            aria-label={interactive ? label : undefined}
            aria-pressed={interactive ? isSel : undefined}
            onClick={() => onSelect?.(apt.number)}
            onMouseEnter={() => onHover?.(apt.number)}
            onMouseLeave={() => onHover?.(null)}
            onFocus={() => onHover?.(apt.number)}
            onBlur={() => onHover?.(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(apt.number);
              }
            }}
          >
            {unit.rooms.flatMap((r) =>
              r.parts.map((p, i) => (
                <rect key={`${r.id}${i}`} x={p[0]} y={p[1]} width={p[2]} height={p[3]} fill="transparent" />
              )),
            )}
            {isSel && (
              <rect
                x={unit.ox}
                y={unit.oy}
                width={unit.w}
                height={unit.h}
                className="fp-sel-outline"
              />
            )}
            {!compact && (
              <g transform={`translate(${cx} ${cyU})`} className={`fp-tag fp-tag-${apt.status} ${isSel ? "is-selected" : ""}`}>
                <rect x={-1.55} y={-0.62} width={3.1} height={1.24} rx={0.62} />
                <circle cx={-1.05} cy={0} r={0.16} className="fp-tag-dot" />
                <text x={0.22} y={-0.06} textAnchor="middle" fontSize={0.42} className="fp-tag-num">
                  {apt.number}
                </text>
                <text x={0.22} y={0.36} textAnchor="middle" fontSize={0.25} className="fp-tag-sub">
                  {apt.layout.typology} · {fmtArea(apt.area)} m²
                </text>
              </g>
            )}
          </g>
        );
      })}

      {!compact && (
        <>
          <NorthArrow x={W + 0.2} y={-2.2} size={1.1} />
          <ScaleBar x={0} y={D + 2.4} />
        </>
      )}
    </svg>
  );
}
