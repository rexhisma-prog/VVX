import type { Apartment } from "@/data/apartments";

export function apartmentHref(a: Pick<Apartment, "projectSlug" | "slug">) {
  return `/projektet/${a.projectSlug}/apartamentet/${a.slug}/`;
}

export function inquiryHref(a: Pick<Apartment, "projectSlug" | "number">) {
  return `/kontakti/?apartamenti=${encodeURIComponent(a.number)}&projekti=${encodeURIComponent(a.projectSlug)}`;
}
