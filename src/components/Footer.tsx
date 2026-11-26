import Link from "next/link";
import BrandLogo from "./BrandLogo";
import { nav, site, whatsappLink } from "@/data/site";
import { projects } from "@/data/projects";

export default function Footer() {
  return (
    <footer className="bg-brand-deep text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <BrandLogo tone="light" id="footer" className="h-16 w-auto" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            Ndërtim dhe zhvillim i objekteve të banimit me fokus te planifikimi, cilësia e zbatimit dhe
            jetesa e përditshme e banorëve.
          </p>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow text-white">Navigimi</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-white">Projektet</h2>
          <ul className="mt-5 space-y-2.5 text-sm">
            {projects.map((p) => (
              <li key={p.slug}>
                <Link href={`/projektet/${p.slug}/`} className="hover:text-white">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/apartamentet/" className="hover:text-white">
                Zgjidh apartamentin
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-white">Kontakti</h2>
          <address className="mt-5 space-y-2.5 text-sm not-italic">
            <p>{site.address}</p>
            <p>
              <a href={site.phoneHref} className="hover:text-white">
                {site.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${site.email}`} className="break-all hover:text-white">
                {site.email}
              </a>
            </p>
            <p>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp
              </a>
            </p>
          </address>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} VVX Construction. Të gjitha të drejtat e rezervuara.</p>
          <p>
            Projektet, apartamentet dhe planimetritë në këtë faqe janë përmbajtje demonstruese.
          </p>
        </div>
      </div>
    </footer>
  );
}
