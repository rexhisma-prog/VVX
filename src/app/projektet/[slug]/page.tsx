import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Gallery from "@/components/Gallery";
import { Arrow, ContactCta, DemoNote, PageHero, SectionIntro } from "@/components/ui";
import ApartmentExplorer from "@/components/plan/ApartmentExplorer";
import { apartmentHref } from "@/lib/links";
import UnitPlanSvg from "@/components/plan/UnitPlanSvg";
import { getProject, projects, PROJECT_STATUS_LABEL } from "@/data/projects";
import { apartmentsByBuilding, bedroomsLabel, formatArea, type Apartment } from "@/data/apartments";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.excerpt,
    openGraph: { images: [{ url: p.hero.src }] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const apts = apartmentsByBuilding(p.buildingId);
  const free = apts.filter((a) => a.status === "available").length;

  // one representative apartment per layout type
  const types = new Map<string, Apartment[]>();
  for (const a of apts) types.set(a.layout.id, [...(types.get(a.layout.id) ?? []), a]);
  const typeList = [...types.values()].map((list) => ({
    rep: list.find((a) => !a.slot.mirrorX && !a.slot.mirrorY) ?? list[0],
    total: list.length,
    free: list.filter((a) => a.status === "available").length,
    firstFree: list.find((a) => a.status === "available"),
  }));

  return (
    <>
      <PageHero
        eyebrow={`${PROJECT_STATUS_LABEL[p.status]} · ${p.location}`}
        title={p.name}
        image={p.hero}
        intro={p.tagline}
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/projektet/", label: "Projektet" },
          { href: `/projektet/${p.slug}/`, label: p.name },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href="#apartamentet" className="btn bg-white text-brand hover:bg-stone">
            Zgjidh apartamentin <Arrow />
          </Link>
          <Link
            href={`/kontakti/?projekti=${p.slug}`}
            className="btn border-white/50 text-white hover:border-white hover:bg-white/10"
          >
            Kërko informacion
          </Link>
        </div>
      </PageHero>

      {/* key facts */}
      <section className="border-b border-line bg-white">
        <dl className="container-x grid grid-cols-2 md:grid-cols-4">
          {[
            ["Statusi", PROJECT_STATUS_LABEL[p.status]],
            ["Kate", p.floorsLabel],
            ["Apartamente", String(apts.length)],
            ["Të lira", String(free)],
          ].map(([k, v], i) => (
            <div
              key={k}
              className={`py-7 md:py-9 ${i % 2 === 1 ? "pl-6 md:pl-8" : ""} ${i > 0 ? "md:border-l md:border-line md:pl-8" : ""} ${i < 2 ? "border-b border-line md:border-b-0" : ""}`}
            >
              <dt className="eyebrow text-muted">{k}</dt>
              <dd className="display mt-2 text-[2.2rem]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* intro + specs */}
      <section className="py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionIntro eyebrow="Projekti" title="Rreth objektit">
              {p.intro.map((t) => (
                <p key={t} className="mt-4 first:mt-0">
                  {t}
                </p>
              ))}
            </SectionIntro>
            <DemoNote className="mt-8 text-muted">
              Projekt demonstrues · të dhënat do të zëvendësohen me informacionin real
            </DemoNote>
          </div>
          <div className="lg:col-span-5 lg:col-start-8" data-reveal>
            <h3 className="eyebrow text-brand">Specifikimet e objektit</h3>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {[{ label: "Lokacioni", value: p.location }, ...p.specs].map((s) => (
                <div key={s.label} className="grid grid-cols-[10rem_1fr] gap-4 py-4 text-sm">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <li key={h} className="border border-line px-3 py-1.5 text-xs text-muted">
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* exterior gallery */}
      <section className="bg-stone py-20 md:py-28">
        <div className="container-x">
          <SectionIntro eyebrow="Eksterieri" title="Arkitektura e objektit" />
          <div className="mt-12">
            <Gallery images={p.exterior} variant="mosaic" label="Galeria e eksterierit" />
          </div>
        </div>
      </section>

      {/* construction details */}
      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionIntro eyebrow="Ndërtimi" title="Detajet e ndërtimit">
            Përshkrim demonstrues i sistemeve dhe materialeve kryesore të objektit.
          </SectionIntro>
          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {p.construction.map((c, i) => (
              <div key={c.title} className="bg-white p-8" data-reveal>
                <p className="display text-xl text-brand/50">0{i + 1}</p>
                <h3 className="display mt-6 text-[1.7rem]">{c.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* interior gallery */}
      <section className="bg-brand py-20 text-white md:py-28">
        <div className="container-x">
          <SectionIntro eyebrow="Interieri" title="Hapësira të menduara për jetesë" tone="light">
            Fotografi demonstruese të standardit të interierit.
          </SectionIntro>
          <div className="mt-12">
            <Gallery images={p.interior} variant="grid" label="Galeria e interierit" />
          </div>
        </div>
      </section>

      {/* interactive floor plans */}
      <section id="apartamentet" className="scroll-mt-20 py-20 md:py-28">
        <div className="container-x">
          <SectionIntro eyebrow="Planimetritë" title="Zgjidhni katin dhe apartamentin">
            Planimetritë dhe statuset janë demonstruese dhe tregojnë mënyrën si do të prezantohet inventari real i
            apartamenteve.
          </SectionIntro>
          <div className="mt-12">
            <ApartmentExplorer buildingIds={[p.buildingId]} />
          </div>
        </div>
      </section>

      {/* apartment types */}
      <section className="border-t border-line bg-stone py-20 md:py-28">
        <div className="container-x">
          <SectionIntro eyebrow="Tipet e apartamenteve" title="Tri tipologji, secila me planimetrinë e vet" />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {typeList.map(({ rep, total, free: f, firstFree }) => (
              <article key={rep.layout.id} className="flex flex-col border border-line bg-white" data-reveal>
                <div className="flex aspect-[4/3] items-center justify-center border-b border-line p-4 [&>svg]:max-h-full">
                  <UnitPlanSvg apartment={rep} id={`type-${rep.layout.id}`} labels="none" dims={false} north={false} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="eyebrow text-brand">{rep.layout.name}</p>
                  <h3 className="display mt-3 text-[2rem]">
                    {rep.layout.typology} · {formatArea(rep.area)}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    {bedroomsLabel(rep.layout.bedrooms)} · {rep.layout.bathrooms} banjo · ballkon {formatArea(rep.balcony)}
                  </p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{rep.layout.description}</p>
                  <p className="mt-5 text-sm">
                    <span className="font-semibold">{f}</span> <span className="text-muted">nga {total} të lira</span>
                  </p>
                  <Link
                    href={apartmentHref(firstFree ?? rep)}
                    className="mt-5 inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand"
                  >
                    Shiko planimetrinë <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ContactCta
        title="Interesoheni për këtë projekt?"
        text="Na kontaktoni për disponueshmërinë, afatet dhe kushtet e blerjes. Do t'ju përgjigjemi me informacionin e plotë për apartamentin që ju intereson."
      />
    </>
  );
}
