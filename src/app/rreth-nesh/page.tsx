import type { Metadata } from "next";
import Image from "next/image";
import { ContactCta, PageHero, SectionIntro } from "@/components/ui";
import { img } from "@/data/images";

export const metadata: Metadata = {
  title: "Rreth Nesh",
  description:
    "VVX Construction – kompani ndërtimi dhe zhvillimi banesor në Gjakovë. Misioni, vizioni, vlerat dhe filozofia jonë e ndërtimit.",
};

/* Editable company texts. Placeholder wording: confirm with the client. */
const values = [
  { title: "Transparenca", text: "Informacion i qartë për çdo apartament: sipërfaqe, planimetri, status dhe afate." },
  { title: "Saktësia", text: "Punime të kontrolluara në çdo fazë dhe respektim i projektit të miratuar." },
  { title: "Qëndrueshmëria", text: "Zgjidhje konstruktive dhe materiale që ruajnë vlerën e objektit me kalimin e kohës." },
  { title: "Respekti", text: "Për banorët, fqinjët dhe qytetin në të cilin ndërtojmë." },
];

const quality = [
  "Përzgjedhje e kujdesshme e materialeve dhe e furnitorëve",
  "Mbikëqyrje e vazhdueshme teknike gjatë zbatimit",
  "Izolim termik dhe akustik i trajtuar si prioritet",
  "Detaje të përfunduara me kujdes në hyrje, shkallë dhe fasadë",
  "Dokumentim i qartë i apartamentit në dorëzim",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Rreth Nesh"
        title="Ndërtojmë hapësira ku jetohet mirë"
        image={img.consPlans}
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/rreth-nesh/", label: "Rreth Nesh" },
        ]}
        intro="VVX Construction është kompani ndërtimi dhe zhvillimi banesor me seli në Gjakovë."
      />

      {/* intro */}
      <section className="py-20 md:py-32">
        <div className="container-x grid gap-14 md:grid-cols-12">
          <p className="eyebrow text-brand md:col-span-3" data-reveal>
            Kompania
          </p>
          <div className="md:col-span-8">
            <p className="display text-[2rem] leading-[1.2] md:text-[2.8rem]" data-reveal>
              Ne planifikojmë, ndërtojmë dhe shesim objekte banimi ku arkitektura, funksionaliteti dhe cilësia e
              zbatimit trajtohen si një e tërë.
            </p>
            <div className="mt-10 grid gap-8 text-muted md:grid-cols-2" data-reveal>
              <p className="leading-relaxed">
                Puna jonë fillon shumë përpara kantierit: me analizën e parcelës, orientimin ndaj diellit, lidhjen
                me rrugën dhe me mënyrën si do të përdoren hapësirat nga banorët.
              </p>
              <p className="leading-relaxed">
                Gjatë ndërtimit, ekipi ynë ndjek çdo fazë nga afër, me qëllim që apartamenti i dorëzuar të jetë
                ashtu siç është premtuar në planimetri.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* mission / vision */}
      <section className="bg-stone">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[360px] md:min-h-[640px]" data-reveal>
            <Image src={img.extFacadeCorner.src} alt={img.extFacadeCorner.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex items-center px-5 py-20 md:px-16 lg:px-24">
            <div className="max-w-lg space-y-14">
              <div data-reveal>
                <p className="eyebrow text-brand">Misioni</p>
                <h2 className="display mt-4 text-[2.3rem]">Shtëpi të mira për t&apos;u jetuar</h2>
                <p className="mt-4 leading-relaxed text-muted">
                  Të ndërtojmë apartamente funksionale, të ndriçuara dhe të qëndrueshme, që i shërbejnë mirë
                  familjes sot dhe ruajnë vlerën në të ardhmen.
                </p>
              </div>
              <div data-reveal>
                <p className="eyebrow text-brand">Vizioni</p>
                <h2 className="display mt-4 text-[2.3rem]">Një emër i besueshëm në ndërtim</h2>
                <p className="mt-4 leading-relaxed text-muted">
                  Të jemi zgjedhja e parë për ata që kërkojnë arkitekturë të qetë, cilësi të zbatimit dhe
                  komunikim të hapur gjatë gjithë procesit të blerjes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* values */}
      <section className="py-20 md:py-32">
        <div className="container-x">
          <SectionIntro eyebrow="Vlerat" title="Çfarë na udhëheq" />
          <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={v.title} className="bg-white p-8 md:p-10" data-reveal>
                <p className="display text-xl text-brand/50">0{i + 1}</p>
                <h3 className="display mt-8 text-[1.9rem]">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* philosophy */}
      <section className="bg-brand py-20 text-white md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro eyebrow="Filozofia e ndërtimit" title="Më pak efekte, më shumë kujdes" tone="light">
              <p>
                Besojmë se arkitektura e mirë nuk ka nevojë të bërtasë. Ajo duket në proporcionet e dhomave, në
                dritën që hyn në mëngjes, në një derë që mbyllet mirë edhe pas shumë vitesh.
              </p>
              <p className="mt-4">
                Prandaj investojmë kohë në planifikim dhe në detaje që shpesh nuk shihen në fotografi, por ndihen
                çdo ditë.
              </p>
            </SectionIntro>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:col-span-6 lg:col-start-7">
            <div className="relative aspect-[3/4]" data-reveal>
              <Image src={img.extWhite.src} alt={img.extWhite.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative mt-16 aspect-[3/4]" data-reveal>
              <Image src={img.intDiningGreen.src} alt={img.intDiningGreen.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* quality */}
      <section className="py-20 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionIntro eyebrow="Cilësia dhe detaji" title="Kujdesi që vazhdon pas planimetrisë">
              Cilësia nuk është një fazë e veçantë — ajo ndërtohet në çdo vendim, nga struktura deri te dorezat e
              dyerve.
            </SectionIntro>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {quality.map((q, i) => (
              <li key={q} className="flex gap-6 border-t border-line py-6 last:border-b" data-reveal>
                <span className="display w-8 shrink-0 text-xl text-brand">{String(i + 1).padStart(2, "0")}</span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="container-x mt-14">
          <p className="border-l-2 border-sand pl-4 text-xs leading-relaxed text-muted">
            Tekstet e kësaj faqeje janë përmbajtje fillestare dhe mund të përshtaten me historikun, ekipin dhe
            të dhënat zyrtare të kompanisë.
          </p>
        </div>
      </section>

      <ContactCta />
    </>
  );
}
