import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { apartments } from "@/data/apartments";
import { apartmentHref } from "@/lib/links";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/rreth-nesh/", "/projektet/", "/apartamentet/", "/galeria/", "/kontakti/"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}` })),
    ...projects.map((p) => ({ url: `${site.url}/projektet/${p.slug}/` })),
    ...apartments.map((a) => ({ url: `${site.url}${apartmentHref(a)}` })),
  ];
}
