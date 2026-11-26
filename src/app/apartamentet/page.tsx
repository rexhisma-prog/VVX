import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactCta, DemoNote, PageHero } from "@/components/ui";
import ApartmentExplorer from "@/components/plan/ApartmentExplorer";
import { buildings } from "@/data/buildings";

export const metadata: Metadata = {
  title: "Zgjidh apartamentin",
  description:
    "Përzgjedhësi interaktiv i apartamenteve: zgjidhni objektin, katin dhe apartamentin për të parë planimetrinë, sipërfaqet dhe statusin.",
};

export default function ApartmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Përzgjedhësi i apartamenteve"
        title="Zgjidh apartamentin"
        intro="Zgjidhni objektin dhe katin, pastaj klikoni mbi apartamentin për të parë planimetrinë individuale, dhomat dhe statusin."
        crumbs={[
          { href: "/", label: "Ballina" },
          { href: "/projektet/", label: "Projektet" },
          { href: "/apartamentet/", label: "Apartamentet" },
        ]}
      >
        <DemoNote className="text-white/80">Planimetri dhe statuse demonstruese</DemoNote>
      </PageHero>
      <section className="py-14 md:py-20">
        <div className="container-x">
          <Suspense>
            <ApartmentExplorer buildingIds={buildings.map((b) => b.id)} />
          </Suspense>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
