import Image from "next/image";
import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import { Arrow, ContactCta, SectionIntro } from "@/components/ui";
import FloorPlanSvg from "@/components/plan/FloorPlanSvg";
import { projects, PROJECT_STATUS_LABEL } from "@/data/projects";
import { img } from "@/data/images";
import { getBuilding } from "@/data/buildings";
import { apartments, apartmentsOnFloor } from "@/data/apartments";

const pillars = [
  {
    title: "Cilësia",
    text: "Materiale të zgjedhura me kujdes dhe kontroll i vazhdueshëm i punimeve në çdo fazë të ndërtimit.",
  },
  {
    title: "Planifikimi",
    text: "Çdo projekt fillon me analizë të lokacionit, orientimit dhe nevojave reale të banorëve.",
  },
  {
    title: "Arkitektura",
    text: "Volume të qarta, fasada të qeta dhe detaje që qëndrojnë bukur edhe pas shumë vitesh.",
  },
  {
    title: "Funksionaliteti",
    text: "Planimetri pa hapësira të humbura, me ndarje të qartë mes zonës së ditës dhe asaj të natës.",
  },
  {
    title: "Përvoja e klientit",
    text: "Informacion transparent për çdo apartament dhe komunikim i drejtpërdrejtë nga takimi i parë deri te dorëzimi.",
  },
];

export default function Home() {
  const lumi = getBuilding("lumi")!;
  const available = apartments.filter((a) => a.status === "available").length;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex h-[100svh] min-h-[640px] items-end overflow-hidden text-white">
        <HeroVideo src="/video/vvx-hero.mp4" poster={img.heroPoster.src} />
        <div className="hero-overlay absolute inset-0" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-brand-deep/20" aria-hidden />

        <div className="container-x relative pb-20 md:pb-24">
          <div className="max-w-4xl">
            <p className="eyebrow anim-rise flex items-center gap-4 text-white/75">
              <span className="anim-line block h-px w-12 bg-white/60" />
              VVX Construction · Gjakovë
            </p>
            <h1 className="display anim-rise mt-6 text-[3.1rem] [animation-delay:150ms] sm:text-[4.2rem] md:text-[5.6rem] lg:text-[6.4rem]">
              Banim bashkëkohor,<br className="hidden sm:block" />{" "}
              <em className="font-normal italic text-white/85">i&nbsp;ndërtuar me kujdes.</em>
            </h1>
            <p className="anim-rise mt-7 max-w-xl text-base leading-relaxed text-white/80 [animation-delay:300ms] md:text-lg">
              Ndërtojmë dhe shesim apartamente banimi me planifikim të qartë, materiale cilësore dhe
              vëmendje ndaj çdo detaji — nga themelet deri te dorëzimi i çelësave.
            </p>
            <div className="anim-rise mt-10 flex flex-wrap gap-3 [animation-delay:450ms]">
              <Link href="/projektet/" className="btn bg-white text-brand hover:bg-stone">
                Zbulo Projektet <Arrow />
              </Link>
              <Link href="/kontakti/" className="btn border-white/50 text-white hover:border-white hover:bg-white/10">
                Na Kontakto
              </Link>
            </div>
          </div>
        </div>

        <div className="anim-fade absolute bottom-8 right-5 hidden items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/60 [animation-delay:900ms] md:right-10 md:flex xl:right-14">
          <span>Lëviz poshtë</span>
          <span className="relative block h-12 w-px overflow-hidden bg-white/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[rise_1.8s_ease-in-out_infinite] bg-white" />
          </span>
        </div>
      </section>

      {/* ============ STATEMENT ============ */}
      <section className="bg-white py-24 md:py-36">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <p className="eyebrow text-brand md:col-span-3" data-reveal>
            Qasja jonë
          </p>
          <div className="md:col-span-9">
            <p className="display text-[2.1rem] leading-[1.15] text-ink md:text-[3.2rem]" data-reveal>
              Çdo objekt që ndërtojmë fillon me një pyetje të thjeshtë:{" "}
              <em className="text-brand">si do të jetohet në të?</em> Përgjigjja përcakton dritën, proporcionet
              dhe mënyrën si lidhen hapësirat.
            </p>
            <div className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3" data-reveal>
              <div>
                <p className="display text-5xl text-brand">{projects.length}</p>
                <p className="mt-2 text-sm text-muted">projekte demonstruese të prezantuara</p>
              </div>
              <div>
                <p className="display text-5xl text-brand">{apartments.length}</p>
                <p className="mt-2 text-sm text-muted">apartamente me planimetri individuale</p>
              </div>
              <div>
                <p className="display text-5xl text-brand">{available}</p>
                <p className="mt-2 text-sm text-muted">apartamente me status &ldquo;e lirë&rdquo;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section className="bg-stone py-24 md:py-32" aria-labelledby="projects-title">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionIntro eyebrow="Projektet" title={<span id="projects-title">Objekte banimi me karakter</span>}>
              Tre projekte demonstruese që tregojnë si VVX Construction prezanton objektet, apartamentet dhe
              planimetritë e saj.
            </SectionIntro>
            <Link href="/projektet/" className="btn shrink-0 border-brand/30 text-brand hover:border-brand" data-reveal>
              Të gjitha projektet <Arrow />
            </Link>
          </div>

          <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
            {projects.map((p, i) => (
              <article key={p.slug} className={i === 1 ? "md:mt-20" : ""} data-reveal>
                <Link href={`/projektet/${p.slug}/`} className="group block">
                  <div className="zoom-img relative aspect-[4/5] overflow-hidden bg-stone-2">
                    <Image
                      src={p.hero.src}
                      alt={p.hero.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute left-4 top-4 bg-white/95 px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand">
                      {PROJECT_STATUS_LABEL[p.status]}
                    </span>
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">{p.location}</p>
                      <h3 className="display mt-2 text-[2rem]">{p.name}</h3>
                    </div>
                    <span className="mt-3 text-sm text-muted">{p.floorsLabel}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{p.excerpt}</p>
                  <span className="mt-5 inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand">
                    Shiko projektin
                    <Arrow className="h-3 w-5 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ABOUT ============ */}
      <section className="py-24 md:py-36">
        <div className="container-x grid items-center gap-14 md:grid-cols-12">
          <div className="relative md:col-span-6" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image src={img.consPlans.src} alt={img.consPlans.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-10 right-0 hidden w-[46%] border-8 border-white md:block">
              <div className="relative aspect-square">
                <Image src={img.extFacadeCorner.src} alt={img.extFacadeCorner.alt} fill sizes="25vw" className="object-cover" />
              </div>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8">
            <SectionIntro eyebrow="Rreth VVX Construction" title="Ndërtojmë me qetësi, saktësi dhe përgjegjësi">
              <p>
                VVX Construction është kompani ndërtimi dhe zhvillimi banesor me seli në Gjakovë. Ne planifikojmë,
                ndërtojmë dhe shesim objekte banimi ku arkitektura dhe funksionaliteti trajtohen si një e tërë.
              </p>
            </SectionIntro>
            <dl className="mt-10 space-y-7" data-reveal>
              {[
                ["Misioni", "Të ndërtojmë apartamente që janë të mira për t'u jetuar sot dhe ruajnë vlerën nesër."],
                ["Vizioni", "Të jemi emër i besueshëm për familjet që kërkojnë cilësi, transparencë dhe arkitekturë të qetë."],
                ["Filozofia", "Më pak efekte, më shumë kujdes: dritë natyrore, proporcione të mira dhe detaje të zbatuara saktë."],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 border-t border-line pt-5">
                  <dt className="eyebrow pt-1 text-brand">{k}</dt>
                  <dd className="leading-relaxed text-muted">{v}</dd>
                </div>
              ))}
            </dl>
            <Link href="/rreth-nesh/" className="btn mt-10 bg-brand text-white hover:bg-brand-soft" data-reveal>
              Më shumë rreth nesh <Arrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-brand py-24 text-white md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionIntro eyebrow="Pse VVX" title="Pesë parime që udhëheqin çdo projekt" tone="light" />
          </div>
          <ol className="lg:col-span-7 lg:col-start-6">
            {pillars.map((p, i) => (
              <li
                key={p.title}
                className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-white/15 py-7 md:grid-cols-[4.5rem_14rem_1fr] md:gap-8"
                data-reveal
              >
                <span className="display text-2xl text-white/45">0{i + 1}</span>
                <h3 className="display text-[1.9rem] leading-tight">{p.title}</h3>
                <p className="col-start-2 leading-relaxed text-white/70 md:col-start-3">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ FLOOR PLAN TEASER ============ */}
      <section className="py-24 md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionIntro eyebrow="Planimetri interaktive" title="Zgjidhni katin. Zgjidhni apartamentin.">
              <p>
                Shfletoni objektet kat pas kati, shikoni statusin e çdo apartamenti dhe hapni planimetrinë e tij
                me dhomat, sipërfaqet dhe ballkonin.
              </p>
            </SectionIntro>
            <Link href="/apartamentet/" className="btn mt-10 bg-brand text-white hover:bg-brand-soft" data-reveal>
              Zgjidh apartamentin <Arrow />
            </Link>
          </div>
          <Link
            href="/apartamentet/"
            className="group block border border-line bg-white p-3 transition-colors hover:border-brand md:p-6 lg:col-span-8"
            aria-label="Hap përzgjedhësin e apartamenteve"
            data-reveal
          >
            <FloorPlanSvg building={lumi} apartments={apartmentsOnFloor("lumi", 3)} id="home-teaser" selected="LU-303" />
            <p className="mt-3 flex items-center justify-between px-1 text-xs text-muted">
              <span>Rezidenca Lumi · Kati 3</span>
              <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.18em] text-brand">
                Hap planimetrinë <Arrow className="h-3 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </p>
          </Link>
        </div>
      </section>

      {/* ============ ARCHITECTURE SHOWCASE ============ */}
      <section className="bg-stone py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionIntro eyebrow="Arkitektura" title="Nga fasada te detaji i fundit" />
            <Link href="/galeria/" className="btn shrink-0 border-brand/30 text-brand hover:border-brand" data-reveal>
              Hap galerinë <Arrow />
            </Link>
          </div>
          <div className="mt-14 grid gap-4 md:grid-cols-12 md:gap-5">
            {[
              { im: img.extPark, cls: "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto", cap: "Eksterier" },
              { im: img.intLiving1, cls: "md:col-span-5 aspect-[4/3]", cap: "Ndenja" },
              { im: img.intKitchen2, cls: "md:col-span-5 aspect-[4/3]", cap: "Kuzhina" },
              { im: img.consRebar, cls: "md:col-span-4 aspect-[4/3]", cap: "Detaje ndërtimi" },
              { im: img.intBedroom1, cls: "md:col-span-4 aspect-[4/3]", cap: "Dhoma e gjumit" },
              { im: img.intBath1, cls: "md:col-span-4 aspect-[4/3]", cap: "Banjo" },
            ].map(({ im, cls, cap }) => (
              <figure key={im.src} className={`zoom-img group relative overflow-hidden bg-stone-2 ${cls}`} data-reveal>
                <Image src={im.src} alt={im.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-5 pt-16 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white">
                  {cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
