import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ApartmentStatus } from "@/data/apartment-status";
import { STATUS_LABEL } from "@/data/apartments";
import type { SiteImage } from "@/data/images";

export function Arrow({ className = "h-3 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" fill="none" stroke="currentColor" strokeWidth="1.2" className={className} aria-hidden>
      <path d="M0 6h18M13 1l5 5-5 5" />
    </svg>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "dark",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div
      data-reveal
      className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}
    >
      {eyebrow && (
        <p className={`eyebrow flex items-center gap-4 ${align === "center" ? "justify-center" : ""} ${light ? "text-white/70" : "text-brand"}`}>
          <span className={`h-px w-10 ${light ? "bg-white/40" : "bg-brand/40"}`} />
          {eyebrow}
        </p>
      )}
      <h2 className={`display mt-5 text-[2.5rem] md:text-[3.4rem] ${light ? "text-white" : "text-ink"}`}>{title}</h2>
      {children && (
        <div className={`mt-6 text-[1.02rem] leading-relaxed ${light ? "text-white/75" : "text-muted"}`}>{children}</div>
      )}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  image?: SiteImage;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <section className={`relative overflow-hidden bg-brand text-white ${image ? "min-h-[72vh]" : ""} flex items-end`}>
      {image && (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="hero-overlay absolute inset-0" style={{ ["--hero-overlay-opacity" as string]: "0.58" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent" />
        </>
      )}
      <div className={`container-x relative w-full ${image ? "pb-16 pt-40 md:pb-20" : "pb-16 pt-36 md:pb-20 md:pt-44"}`}>
        {crumbs && (
          <nav aria-label="Rruga e navigimit" className="anim-fade mb-8 text-xs tracking-wider text-white/60">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-white/85">
                      {c.label}
                    </span>
                  ) : (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow anim-rise text-white/70">{eyebrow}</p>}
        <h1 className="display anim-rise mt-5 max-w-4xl text-[2.9rem] [animation-delay:120ms] sm:text-[3.6rem] md:text-[5rem]">
          {title}
        </h1>
        {intro && (
          <div className="anim-rise mt-6 max-w-2xl text-base leading-relaxed text-white/80 [animation-delay:240ms] md:text-lg">
            {intro}
          </div>
        )}
        {children && <div className="anim-rise mt-10 [animation-delay:360ms]">{children}</div>}
      </div>
    </section>
  );
}

export function StatusBadge({ status, className = "" }: { status: ApartmentStatus; className?: string }) {
  const color =
    status === "available" ? "bg-st-available" : status === "reserved" ? "bg-st-reserved" : "bg-st-sold";
  return (
    <span className={`inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${className}`}>
      <span className={`h-2 w-2 rounded-full ${color}`} aria-hidden />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StatusLegend({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`} aria-label="Legjenda e statusit">
      {(["available", "reserved", "sold"] as const).map((s) => (
        <li key={s}>
          <StatusBadge status={s} className="text-muted" />
        </li>
      ))}
    </ul>
  );
}

export function DemoNote({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 border border-current/20 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${className}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {children ?? "Projekt demonstrues"}
    </p>
  );
}

export function ContactCta({
  title = "Le të flasim për shtëpinë tuaj të ardhshme",
  text = "Na tregoni çfarë kërkoni dhe ekipi ynë do t'ju njoftojë për apartamentet e lira, planimetritë dhe kushtet e pagesës me këste për 5 ose 10 vite, pa kamatë dhe pa garantues.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute inset-0 opacity-[0.07]">
        <svg className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <pattern id="cta-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M64 0H0V64" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>
      <div className="container-x relative grid gap-10 py-20 md:grid-cols-12 md:items-end md:py-28">
        <div className="md:col-span-7" data-reveal>
          <p className="eyebrow text-white/60">Kontakti</p>
          <h2 className="display mt-5 text-[2.6rem] md:text-[3.8rem]">{title}</h2>
        </div>
        <div className="md:col-span-5" data-reveal>
          <p className="leading-relaxed text-white/75">{text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakti/" className="btn bg-white text-brand hover:bg-stone">
              Na Kontakto <Arrow />
            </Link>
            <Link href="/apartamentet/" className="btn border-white/40 text-white hover:border-white">
              Shiko apartamentet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
