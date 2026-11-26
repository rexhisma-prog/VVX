import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, ContactCta, PageHero, StatusBadge, StatusLegend } from "@/components/ui";
import PlanViewer from "@/components/plan/PlanViewer";
import UnitPlanSvg from "@/components/plan/UnitPlanSvg";
import FloorPlanSvg from "@/components/plan/FloorPlanSvg";
import PrintButton from "@/components/PrintButton";
import PaymentTerms from "@/components/PaymentTerms";
import {
  apartments,
  apartmentsOnFloor,
  bedroomsLabel,
  floorLabel,
  formatArea,
  getApartment,
  STATUS_LABEL,
} from "@/data/apartments";
import { getBuilding } from "@/data/buildings";
import { getProject } from "@/data/projects";
import { roomArea, roomDims } from "@/lib/plan/geometry";
import { apartmentHref, inquiryHref } from "@/lib/links";
import { whatsappLink } from "@/data/site";

type Params = { slug: string; apt: string };

export function generateStaticParams() {
  return apartments.map((a) => ({ slug: a.projectSlug, apt: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug, apt } = await params;
  const a = getApartment(slug, apt);
  const p = getProject(slug);
  if (!a || !p) return {};
  return {
    title: `Apartamenti ${a.number} – ${p.name}`,
    description: `${a.layout.typology}, ${formatArea(a.area)}, ${bedroomsLabel(a.layout.bedrooms)}, ${floorLabel(a.floor).toLowerCase()} – ${p.name}. Statusi: ${STATUS_LABEL[a.status]}.`,
  };
}

const n1 = (n: number) => n.toFixed(1).replace(".", ",");

export default async function ApartmentPage({ params }: { params: Promise<Params> }) {
  const { slug, apt } = await params;
  const a = getApartment(slug, apt);
  const p = getProject(slug);
  if (!a || !p) notFound();
  const b = getBuilding(a.buildingId)!;

  const rooms = a.layout.rooms.filter((r) => r.kind !== "balcony");
  const balconies = a.layout.rooms.filter((r) => r.kind === "balcony");
  const sameStack = apartments.filter((x) => x.buildingId === a.buildingId && x.slot.slot === a.slot.slot);
  const floorApts = apartmentsOnFloor(a.buildingId, a.floor);
  const idx = floorApts.findIndex((x) => x.number === a.number);
  const prev = floorApts[(idx - 1 + floorApts.length) % floorApts.length];
  const next = floorApts[(idx + 1) % floorApts.length];

  const specs: [string, string][] = [
    ["Objekti", p.name],
    ["Kati", floorLabel(a.floor)],
    ["Tipi", `${a.layout.name} · ${a.layout.typology}`],
    ["Sipërfaqja e brendshme", formatArea(a.area)],
    ["Ballkoni", a.balcony ? formatArea(a.balcony) : "—"],
    ["Dhoma gjumi", String(a.layout.bedrooms)],
    ["Banjo", String(a.layout.bathrooms)],
    ["Orientimi", a.slot.mirrorY ? "Fasada jugore" : "Fasada veriore"],
  ];

  return (
    <>
      <PageHero
        eyebrow={`${p.name} · ${floorLabel(a.floor)}`}
        title={
          <>
            Apartamenti <span className="whitespace-nowrap">{a.number}</span>
          </>
        }
        intro={a.layout.description}
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/projektet/", label: "Projektet" },
          { href: `/projektet/${p.slug}/`, label: p.name },
          { href: apartmentHref(a), label: a.number },
        ]}
      >
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white/80">
          <StatusBadge status={a.status} />
          <span className="text-sm">
            {a.layout.typology} · {formatArea(a.area)} · {bedroomsLabel(a.layout.bedrooms)}
          </span>
        </div>
      </PageHero>

      <section className="py-14 md:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          {/* plan */}
          <div className="lg:col-span-8">
            <PlanViewer label={`Planimetria · ${a.number}`}>
              <UnitPlanSvg apartment={a} id="apt-main" />
            </PlanViewer>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Planimetri demonstruese. Dimensionet janë në metra dhe të matura në boshtet e mureve; sipërfaqet
              përfundimtare përcaktohen në projektin zbatues.
            </p>

            {/* room table */}
            <div className="mt-14">
              <h2 className="display text-[2.2rem]">Sipërfaqet sipas dhomave</h2>
              <table className="mt-6 w-full text-sm">
                <thead>
                  <tr className="border-b border-ink/80 text-left text-[0.68rem] uppercase tracking-[0.16em] text-muted">
                    <th scope="col" className="py-3 font-semibold">Hapësira</th>
                    <th scope="col" className="py-3 font-semibold">Dimensionet</th>
                    <th scope="col" className="py-3 text-right font-semibold">Sipërfaqja</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {rooms.map((r) => {
                    const [w, h] = roomDims(r);
                    return (
                      <tr key={r.id}>
                        <th scope="row" className="py-3.5 text-left font-medium">{r.name}</th>
                        <td className="py-3.5 tabular-nums text-muted">
                          {r.parts.length > 1 ? "formë L · " : ""}
                          {w.toFixed(2)} × {h.toFixed(2)} m
                        </td>
                        <td className="py-3.5 text-right tabular-nums">{n1(roomArea(r))} m²</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-ink/80">
                    <th scope="row" className="py-3.5 text-left font-semibold" colSpan={2}>
                      Sipërfaqja e brendshme
                    </th>
                    <td className="py-3.5 text-right font-semibold tabular-nums">{n1(a.area)} m²</td>
                  </tr>
                  {balconies.map((r) => {
                    const [w, h] = roomDims(r);
                    return (
                      <tr key={r.id} className="border-t border-line">
                        <th scope="row" className="py-3.5 text-left font-medium">{r.name}</th>
                        <td className="py-3.5 tabular-nums text-muted">
                          {w.toFixed(2)} × {h.toFixed(2)} m
                        </td>
                        <td className="py-3.5 text-right tabular-nums">{n1(roomArea(r))} m²</td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-line bg-stone">
                    <th scope="row" className="px-3 py-3.5 text-left font-semibold" colSpan={2}>
                      Gjithsej me ballkon
                    </th>
                    <td className="px-3 py-3.5 text-right font-semibold tabular-nums">{n1(a.area + a.balcony)} m²</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="border border-line">
                <div className="border-b border-line bg-stone p-6">
                  <StatusBadge status={a.status} className="text-muted" />
                  <p className="display mt-3 text-[2.8rem] leading-none">{a.number}</p>
                  <p className="mt-2 text-sm text-muted">Çmimi: sipas kërkesës</p>
                </div>
                <div className="border-b border-line p-4">
                  <PaymentTerms variant="compact" />
                </div>
                <dl className="divide-y divide-line px-6">
                  {specs.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 py-3 text-sm">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="no-print grid gap-2 border-t border-line p-6">
                  {a.status === "sold" ? (
                    <p className="mb-2 text-sm text-muted">
                      Ky apartament është shitur. Na kontaktoni për apartamente të ngjashme të lira.
                    </p>
                  ) : null}
                  <Link href={inquiryHref(a)} className="btn bg-brand text-white hover:bg-brand-soft">
                    Kërko informacion <Arrow />
                  </Link>
                  <a
                    href={whatsappLink(`Përshëndetje, jam i interesuar për apartamentin ${a.number} në ${p.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn border-line text-ink hover:border-brand"
                  >
                    Shkruaj në WhatsApp
                  </a>
                  <PrintButton />
                </div>
              </div>

              <div className="border border-line p-5">
                <p className="eyebrow text-muted">Pozita në kat</p>
                <div className="mt-4">
                  <FloorPlanSvg building={b} apartments={floorApts} selected={a.number} id="keyplan" compact />
                </div>
                <StatusLegend className="mt-3 text-[0.6rem]" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* same type on other floors */}
      <section className="border-t border-line bg-stone py-16 md:py-20">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-brand">I njëjti tip në katet e tjera</p>
              <h2 className="display mt-4 text-[2.2rem] md:text-[2.8rem]">Apartamentet {a.layout.typology} në këtë pozitë</h2>
            </div>
            <div className="flex gap-2">
              <Link href={apartmentHref(prev)} className="btn border-line bg-white text-ink hover:border-brand" aria-label={`Apartamenti i mëparshëm: ${prev.number}`}>
                <Arrow className="h-3 w-5 rotate-180" /> {prev.number}
              </Link>
              <Link href={apartmentHref(next)} className="btn border-line bg-white text-ink hover:border-brand" aria-label={`Apartamenti tjetër: ${next.number}`}>
                {next.number} <Arrow />
              </Link>
            </div>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {[...sameStack].reverse().map((x) => {
              const current = x.number === a.number;
              return (
                <li key={x.number}>
                  <Link
                    href={apartmentHref(x)}
                    aria-current={current ? "page" : undefined}
                    className={`block border p-5 transition-colors ${current ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand"}`}
                  >
                    <p className="text-lg font-semibold">{x.number}</p>
                    <p className={`mt-1 text-sm ${current ? "text-white/70" : "text-muted"}`}>
                      {floorLabel(x.floor)} · {formatArea(x.area)}
                    </p>
                    <StatusBadge status={x.status} className={`mt-4 ${current ? "text-white/80" : "text-muted"}`} />
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="mt-10">
            <Link href={`/projektet/${p.slug}/?kati=${a.floor}&ap=${a.number}#apartamentet`} className="inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand">
              Kthehu te planimetria e katit <Arrow />
            </Link>
          </p>
        </div>
      </section>

      <ContactCta
        title="Dëshironi ta vizitoni apartamentin?"
        text={`Na shkruani për apartamentin ${a.number} dhe do t'ju kontaktojmë për një takim, informacion mbi çmimin dhe afatet e dorëzimit.`}
      />
    </>
  );
}
