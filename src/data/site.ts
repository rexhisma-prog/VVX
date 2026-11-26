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
