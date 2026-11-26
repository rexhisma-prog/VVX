import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Arrow, ContactCta, DemoNote, PageHero } from "@/components/ui";
import { projects, PROJECT_STATUS_LABEL } from "@/data/projects";
import { apartmentsByBuilding } from "@/data/apartments";
import { img } from "@/data/images";

export const metadata: Metadata = {
  title: "Projektet",
  description:
    "Projektet rezidenciale të VVX Construction: objekte banimi me apartamente 1+1, 2+1 dhe 3+1, planimetri interaktive dhe status të përditësuar.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Portofoli"
        title="Projektet"
        image={img.extWhite}
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/projektet/", label: "Projektet" },
        ]}
        intro="Çdo projekt prezantohet me planimetri për çdo kat, statusin e apartamenteve dhe galeri të eksterierit e interierit."
      >
        <DemoNote className="text-white/80">Përmbajtje demonstruese për prezantim</DemoNote>
      </PageHero>

      <section className="py-20 md:py-28">
        <div className="container-x space-y-24 md:space-y-36">
          {projects.map((p, i) => {
            const apts = apartmentsByBuilding(p.buildingId);
            const free = apts.filter((a) => a.status === "available").length;
            const types = [...new Set(apts.map((a) => a.layout.typology))].join(" · ");
            const reverse = i % 2 === 1;
            return (
              <article key={p.slug} className="grid items-center gap-10 md:grid-cols-12 md:gap-14">
                <Link
                  href={`/projektet/${p.slug}/`}
                  className={`zoom-img relative block aspect-[4/3] overflow-hidden bg-stone-2 md:col-span-7 ${reverse ? "md:order-2" : ""}`}
                  data-reveal
                  aria-label={`Shiko projektin ${p.name}`}
                >
                  <Image src={p.hero.src} alt={p.hero.alt} fill sizes="(min-width: 768px) 58vw, 100vw" className="object-cover" />
                </Link>
                <div className={`md:col-span-5 ${reverse ? "md:order-1" : ""}`} data-reveal>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-brand px-3 py-1.5 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-white">
                      {PROJECT_STATUS_LABEL[p.status]}
                    </span>
                    <DemoNote className="text-muted" />
                  </div>
                  <p className="mt-6 text-xs uppercase tracking-[0.18em] text-muted">{p.location}</p>
                  <h2 className="display mt-3 text-[2.8rem] md:text-[3.6rem]">{p.name}</h2>
                  <p className="mt-2 font-serif text-xl italic text-brand">{p.tagline}</p>
                  <p className="mt-6 leading-relaxed text-muted">{p.excerpt}</p>
                  <dl className="mt-8 grid grid-cols-3 border-y border-line py-5 text-sm">
                    <div>
                      <dt className="text-muted">Kate</dt>
                      <dd className="mt-1 font-semibold">{p.floorsLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Apartamente</dt>
                      <dd className="mt-1 font-semibold">{apts.length}</dd>
                    </div>
                    <div>
                      <dt className="text-muted">Të lira</dt>
                      <dd className="mt-1 font-semibold">{free}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-muted">Tipologjitë: {types}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href={`/projektet/${p.slug}/`} className="btn bg-brand text-white hover:bg-brand-soft">
                      Shiko projektin <Arrow />
                    </Link>
                    <Link href={`/projektet/${p.slug}/#apartamentet`} className="btn border-line text-ink hover:border-brand">
                      Planimetritë
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-line bg-stone py-20">
        <div className="container-x flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div data-reveal>
            <p className="eyebrow text-brand">Përzgjedhësi i apartamenteve</p>
            <h2 className="display mt-4 text-[2.4rem] md:text-[3rem]">Krahasoni të gjitha objektet në një vend</h2>
          </div>
          <Link href="/apartamentet/" className="btn shrink-0 bg-brand text-white hover:bg-brand-soft" data-reveal>
            Zgjidh apartamentin <Arrow />
          </Link>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
