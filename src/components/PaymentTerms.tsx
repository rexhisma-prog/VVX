import Link from "next/link";
import { paymentTerms } from "@/data/site";
import { Arrow } from "./ui";

/** Highlighted financing offer (5 or 10 years, no interest, no guarantor). */
export default function PaymentTerms({ variant = "band" }: { variant?: "band" | "compact" }) {
  if (variant === "compact") {
    return (
      <div className="border border-brand/25 bg-brand-tint p-5">
        <p className="eyebrow text-brand">Kushtet e pagesës</p>
        <p className="mt-2 text-sm font-semibold leading-snug text-ink">{paymentTerms.summary}</p>
      </div>
    );
  }
  return (
    <section className="border-b border-line bg-brand-tint" aria-labelledby="payment-title">
      <div className="container-x grid items-center gap-8 py-12 md:py-14 lg:grid-cols-12">
        <div className="lg:col-span-5" data-reveal>
          <p className="eyebrow text-brand">Kushtet e pagesës</p>
          <h2 id="payment-title" className="display mt-3 text-[2.2rem] leading-tight md:text-[2.8rem]">
            {paymentTerms.headline}
          </h2>
          <p className="mt-3 text-muted">{paymentTerms.summary}</p>
        </div>
        <dl className="grid grid-cols-3 border-y border-brand/20 lg:col-span-5" data-reveal>
          {paymentTerms.points.map((pt, i) => (
            <div key={pt.label} className={`py-6 text-center ${i > 0 ? "border-l border-brand/20" : ""}`}>
              <dt className="sr-only">{pt.label}</dt>
              <dd>
                <span className="display block text-[2.2rem] leading-none text-brand md:text-[2.8rem]">{pt.value}</span>
                <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                  {pt.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="lg:col-span-2 lg:text-right" data-reveal>
          <Link href="/kontakti/" className="btn bg-brand text-white hover:bg-brand-soft">
            Pyet për këstet <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}
