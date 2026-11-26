/** Company contact details — edit here, used across the whole site. */
export const site = {
  name: "VVX Construction",
  url: "https://vvx-construction.com",
  domain: "vvx-construction.com",
  address: "Westli Clark, Gjakova, Kosovo, 50000",
  addressShort: "Westli Clark, Gjakovë",
  phone: "049 600 170",
  phoneHref: "tel:+38349600170",
  whatsappNumber: "38349600170",
  email: "vvxconstruction@hotmail.com",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Westli+Clark+Gjakova+Kosovo",
  /** Working hours are a placeholder — confirm with the client. */
  hours: "E hënë – e premte, 08:00 – 17:00",
};

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const nav = [
  { href: "/", label: "Ballina" },
  { href: "/rreth-nesh/", label: "Rreth Nesh" },
  { href: "/projektet/", label: "Projektet" },
  { href: "/galeria/", label: "Galeria" },
  { href: "/kontakti/", label: "Kontakti" },
];

/** Payment / financing offer — shown on home, projects, apartments and contact. */
export const paymentTerms = {
  headline: "Blerje me këste për 5 ose 10 vite",
  summary: "Pagesë me këste për 5 ose 10 vite, pa kamatë dhe pa garantues.",
  points: [
    { value: "5 ose 10", label: "vite me këste" },
    { value: "0%", label: "kamatë" },
    { value: "Pa", label: "garantues" },
  ],
};
