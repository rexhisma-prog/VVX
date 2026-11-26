import type { Metadata } from "next";
import GalleryBrowser from "@/components/GalleryBrowser";
import { ContactCta, PageHero } from "@/components/ui";
import { img } from "@/data/images";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Galeria e VVX Construction: arkitekturë e jashtme, interiere, detaje dhe progres i ndërtimit.",
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Galeria"
        title="Arkitekturë, interier dhe ndërtim"
        image={img.intLiving3}
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/galeria/", label: "Galeria" },
        ]}
        intro="Përzgjedhje fotografish demonstruese nga eksterieri, hapësirat e brendshme dhe kantieri."
      />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <GalleryBrowser />
          <p className="mt-10 text-xs text-muted">
            Fotografitë janë demonstruese dhe do të zëvendësohen me pamje nga projektet e VVX Construction.
          </p>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
