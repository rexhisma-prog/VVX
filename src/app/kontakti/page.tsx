import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { Arrow, PageHero } from "@/components/ui";
import { site, whatsappLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Kontakti",
  description:
    "Kontaktoni VVX Construction për informacion mbi projektet, apartamentet e lira dhe takimet. Westli Clark, Gjakovë · 049 600 170.",
};

export default function ContactPage() {
  const info = [
    { label: "Adresa", value: site.address, href: site.mapsUrl, external: true },
    { label: "Telefoni", value: site.phone, href: site.phoneHref },
    { label: "Email", value: site.email, href: `mailto:${site.email}` },
    { label: "Ueb", value: site.domain, href: site.url, external: true },
    { label: "Orari", value: site.hours },
  ];
  return (
    <>
      <PageHero
        eyebrow="Kontakti"
        title="Na kontaktoni"
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/kontakti/", label: "Kontakti" },
        ]}
        intro="Pyetni për një apartament, kërkoni planimetrinë e plotë ose caktoni një takim në zyrën tonë."
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 className="display text-[2.4rem] md:text-[3rem]">Dërgoni një kërkesë</h2>
            <p className="mt-3 max-w-xl text-muted">Plotësoni formën dhe do t&apos;ju kthejmë përgjigje me informacionin që ju nevojitet.</p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow text-brand">Të dhënat e kontaktit</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {info.map((i) => (
                <div key={i.label} className="py-4">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted">{i.label}</dt>
                  <dd className="mt-1.5 break-words">
                    {i.href ? (
                      <a
                        href={i.href}
                        className="hover:text-brand"
                        {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {i.value}
                      </a>
                    ) : (
                      i.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <a
              href={whatsappLink("Përshëndetje, dëshiroj informacion për apartamentet e VVX Construction.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-8 w-full bg-[#1f6f54] text-white hover:bg-[#185a44]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z" />
              </svg>
              Shkruani në WhatsApp
            </a>
          </aside>
        </div>
      </section>

      {/* map placeholder */}
      <section className="relative overflow-hidden border-t border-line bg-stone-2">
        <div aria-hidden className="absolute inset-0">
          <svg className="h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 480">
            <rect width="1200" height="480" fill="#ebe7e0" />
            <g fill="none" stroke="#dcd6cc" strokeWidth="14">
              <path d="M-20 300 C 200 280 340 340 520 300 S 900 180 1220 220" />
              <path d="M300 -20 L 380 500" />
              <path d="M760 -20 C 740 160 820 300 800 500" />
            </g>
            <g fill="none" stroke="#e2ddd4" strokeWidth="6">
              <path d="M-20 120 L 1220 160" />
              <path d="M-20 420 L 1220 380" />
              <path d="M120 -20 L 160 500" />
              <path d="M560 -20 L 600 500" />
              <path d="M1000 -20 L 980 500" />
            </g>
            <path d="M0 380 C 220 360 420 420 640 400 S 1000 330 1200 350 L 1200 480 L 0 480 Z" fill="#dfe7e4" />
          </svg>
        </div>
        <div className="container-x relative flex min-h-[420px] items-center justify-center py-16">
          <div className="max-w-sm bg-white p-8 text-center shadow-[0_20px_60px_-30px_rgba(4,65,60,0.5)]">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white" aria-hidden>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
            </span>
            <p className="display mt-5 text-2xl">VVX Construction</p>
            <p className="mt-2 text-sm text-muted">{site.address}</p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-brand"
            >
              Hap në Google Maps <Arrow />
            </a>
            <p className="mt-4 text-[0.68rem] text-muted">Hartë ilustruese · harta interaktive mund të shtohet më vonë</p>
          </div>
        </div>
      </section>
    </>
  );
}
