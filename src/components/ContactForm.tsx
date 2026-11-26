"use client";

import { useEffect, useId, useState } from "react";
import { projects } from "@/data/projects";
import { site, whatsappLink } from "@/data/site";
import { Arrow } from "./ui";

/**
 * Contact form with client-side validation.
 *
 * Delivery: set NEXT_PUBLIC_CONTACT_ENDPOINT to a form backend / API route
 * that accepts a JSON POST. Without it the form runs in demonstration mode
 * and says clearly that the message was NOT sent, offering e-mail and
 * WhatsApp with the message pre-filled instead.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

type Fields = {
  name: string;
  phone: string;
  email: string;
  project: string;
  apartment: string;
  message: string;
  consent: boolean;
};
type Errors = Partial<Record<keyof Fields, string>>;
type State = "idle" | "sending" | "sent" | "demo" | "error";

const empty: Fields = { name: "", phone: "", email: "", project: "", apartment: "", message: "", consent: false };

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 3) e.name = "Shkruani emrin dhe mbiemrin.";
  const digits = f.phone.replace(/[^\d]/g, "");
  if (!/^[+\d\s().\/-]+$/.test(f.phone.trim()) || digits.length < 8 || digits.length > 15)
    e.phone = "Shkruani një numër telefoni të vlefshëm (p.sh. 049 600 170).";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Shkruani një adresë email të vlefshme.";
  if (f.message.trim().length < 10) e.message = "Mesazhi duhet të ketë të paktën 10 karaktere.";
  if (!f.consent) e.consent = "Ju lutemi konfirmoni pëlqimin.";
  return e;
}

function composeText(f: Fields) {
  const project = projects.find((p) => p.slug === f.project)?.name;
  return [
    `Emri: ${f.name}`,
    `Telefoni: ${f.phone}`,
    `Email: ${f.email}`,
    project ? `Projekti: ${project}` : null,
    f.apartment ? `Apartamenti: ${f.apartment}` : null,
    "",
    f.message,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

export default function ContactForm() {
  const uid = useId();
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [state, setState] = useState<State>("idle");

  // pre-fill from ?projekti=&apartamenti=
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const project = q.get("projekti") ?? "";
    const apartment = q.get("apartamenti") ?? "";
    if (project || apartment) {
      setF((s) => ({
        ...s,
        project: projects.some((p) => p.slug === project) ? project : s.project,
        apartment,
        message: apartment
          ? `Përshëndetje, jam i interesuar për apartamentin ${apartment}. Ju lutem më dërgoni më shumë informacion.`
          : s.message,
      }));
    }
  }, []);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (touched[k]) setErrors(validate(next));
  };
  const blur = (k: keyof Fields) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors(validate(f));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    setTouched({ name: true, phone: true, email: true, message: true, consent: true });
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }
    if (!ENDPOINT) {
      setState("demo");
      return;
    }
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(f),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("sent");
      setF(empty);
      setTouched({});
    } catch {
      setState("error");
    }
  };

  const field = (k: keyof Fields) => ({
    id: `${uid}-${k}`,
    "aria-invalid": touched[k] && errors[k] ? true : undefined,
    "aria-describedby": touched[k] && errors[k] ? `${uid}-${k}-err` : undefined,
  });
  const err = (k: keyof Fields) =>
    touched[k] && errors[k] ? (
      <p id={`${uid}-${k}-err`} className="mt-2 text-xs text-st-sold">
        {errors[k]}
      </p>
    ) : null;
  const inputCls = (k: keyof Fields) =>
    `mt-2 w-full border-0 border-b bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-muted/60 focus:border-brand focus:ring-0 ${
      touched[k] && errors[k] ? "border-st-sold" : "border-line"
    }`;
  const labelCls = "text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted";

  if (state === "sent") {
    return (
      <div className="border border-brand/30 bg-brand-tint p-8" role="status">
        <p className="eyebrow text-brand">Faleminderit</p>
        <p className="display mt-3 text-3xl">Mesazhi u dërgua.</p>
        <p className="mt-3 text-muted">Do t&apos;ju kontaktojmë sa më shpejt në numrin ose email-in që na keni dhënë.</p>
        <button type="button" onClick={() => setState("idle")} className="btn mt-6 border-brand/30 text-brand">
          Dërgo një mesazh tjetër
        </button>
      </div>
    );
  }

  if (state === "demo") {
    const text = composeText(f);
    return (
      <div className="border border-line bg-stone p-8" role="status">
        <p className="eyebrow text-brand">Forma u plotësua saktë</p>
        <p className="display mt-3 text-3xl">Mesazhi nuk është dërguar ende.</p>
        <p className="mt-4 leading-relaxed text-muted">
          Ky është version demonstrues i faqes dhe dërgimi automatik i formës nuk është konfiguruar. Që mesazhi
          juaj të arrijë te ne, dërgojeni me një klik përmes email-it ose WhatsApp — teksti është i përgatitur.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href={`mailto:${site.email}?subject=${encodeURIComponent("Kërkesë për informacion – VVX Construction")}&body=${encodeURIComponent(text)}`}
            className="btn bg-brand text-white hover:bg-brand-soft"
          >
            Dërgo me email <Arrow />
          </a>
          <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className="btn border-line bg-white text-ink hover:border-brand">
            Dërgo në WhatsApp
          </a>
          <button type="button" onClick={() => setState("idle")} className="btn text-muted hover:text-ink">
            Ndrysho mesazhin
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-name`} className={labelCls}>
          Emri dhe mbiemri *
        </label>
        <input
          {...field("name")}
          type="text"
          autoComplete="name"
          value={f.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          className={inputCls("name")}
          placeholder="Emri Mbiemri"
        />
        {err("name")}
      </div>
      <div>
        <label htmlFor={`${uid}-phone`} className={labelCls}>
          Telefoni *
        </label>
        <input
          {...field("phone")}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          value={f.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={() => blur("phone")}
          className={inputCls("phone")}
          placeholder="+383 4x xxx xxx"
        />
        {err("phone")}
      </div>
      <div>
        <label htmlFor={`${uid}-email`} className={labelCls}>
          Email *
        </label>
        <input
          {...field("email")}
          type="email"
          autoComplete="email"
          value={f.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
          className={inputCls("email")}
          placeholder="emri@shembull.com"
        />
        {err("email")}
      </div>
      <div>
        <label htmlFor={`${uid}-project`} className={labelCls}>
          Projekti
        </label>
        <select
          id={`${uid}-project`}
          value={f.project}
          onChange={(e) => set("project", e.target.value)}
          className={`${inputCls("project")} cursor-pointer`}
        >
          <option value="">Informacion i përgjithshëm</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${uid}-apartment`} className={labelCls}>
          Apartamenti (opsional)
        </label>
        <input
          id={`${uid}-apartment`}
          type="text"
          value={f.apartment}
          onChange={(e) => set("apartment", e.target.value.toUpperCase())}
          className={inputCls("apartment")}
          placeholder="p.sh. LU-302"
        />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`${uid}-message`} className={labelCls}>
          Mesazhi *
        </label>
        <textarea
          {...field("message")}
          rows={5}
          value={f.message}
          onChange={(e) => set("message", e.target.value)}
          onBlur={() => blur("message")}
          className={`${inputCls("message")} resize-y`}
          placeholder="Si mund t'ju ndihmojmë?"
        />
        {err("message")}
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            {...field("consent")}
            type="checkbox"
            checked={f.consent}
            onChange={(e) => set("consent", e.target.checked)}
            onBlur={() => blur("consent")}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
          />
          <span>Pajtohem që të dhënat e mia të përdoren vetëm për t&apos;u kontaktuar në lidhje me këtë kërkesë. *</span>
        </label>
        {err("consent")}
      </div>
      {state === "error" && (
        <p className="border border-st-sold/40 bg-st-sold/5 p-4 text-sm text-st-sold sm:col-span-2" role="alert">
          Mesazhi nuk u dërgua për shkak të një problemi teknik. Provoni përsëri ose na telefononi në {site.phone}.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="btn bg-brand text-white hover:bg-brand-soft disabled:opacity-60">
          {state === "sending" ? "Duke dërguar…" : "Dërgo kërkesën"} <Arrow />
        </button>
        <p className="text-xs text-muted">* Fushat e detyrueshme</p>
      </div>
    </form>
  );
}
