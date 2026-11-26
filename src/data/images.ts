/**
 * Image library. All photos are stored locally in /public/images.
 * Demonstration photography (Unsplash licence) — replace with the client's
 * own renders and photos when available.
 */

export type ImageCategory = "exterior" | "details" | "living" | "kitchen" | "bedroom" | "bathroom" | "construction";

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  category: ImageCategory;
}

export const img = {
  extLumi: { src: "/images/ext-lumi.webp", alt: "Pamje e objektit të banimit me oborr të brendshëm në muzg", width: 1800, height: 1486, category: "exterior" },
  extPark: { src: "/images/ext-park.webp", alt: "Fasadë e bardhë me ballkone të shkallëzuara", width: 1440, height: 1800, category: "exterior" },
  extUra: { src: "/images/ext-ura.webp", alt: "Objekt banimi me fasadë të errët dhe ballkone", width: 1350, height: 1800, category: "exterior" },
  extBalconies: { src: "/images/ext-balconies.webp", alt: "Ballkone në fasadën e një objekti banimi", width: 1800, height: 1200, category: "details" },
  extWhite: { src: "/images/ext-white.webp", alt: "Volume të bardha arkitektonike me dritare të thella", width: 1272, height: 1800, category: "exterior" },
  extFacadeDark: { src: "/images/ext-facade-dark.webp", alt: "Fasadë bashkëkohore me korniza të errëta", width: 1800, height: 1200, category: "exterior" },
  extFacadeCorner: { src: "/images/ext-facade-corner.webp", alt: "Këndi i fasadës me veshje guri dhe dritare", width: 1800, height: 1205, category: "details" },
  detailGeometry: { src: "/images/detail-geometry.webp", alt: "Detaj gjeometrik i fasadës me xham", width: 1800, height: 1200, category: "details" },
  consRebar: { src: "/images/cons-rebar.webp", alt: "Punëtorë duke vendosur armaturën në kantier", width: 1800, height: 1192, category: "construction" },
  consSite: { src: "/images/cons-site.webp", alt: "Kantier ndërtimi në fazën e themeleve", width: 1800, height: 1200, category: "construction" },
  consCranes: { src: "/images/cons-cranes.webp", alt: "Objekte në ndërtim me vinça", width: 1800, height: 1013, category: "construction" },
  consPlans: { src: "/images/cons-plans.webp", alt: "Rishikim i vizatimeve teknike në kantier", width: 1800, height: 1013, category: "construction" },
  intLiving1: { src: "/images/int-living-1.webp", alt: "Ndenjë e ndriçuar me kuzhinë të hapur", width: 1800, height: 1224, category: "living" },
  intLiving2: { src: "/images/int-living-2.webp", alt: "Dhomë ndenje me dritare të mëdha dhe shkallë", width: 1800, height: 1200, category: "living" },
  intLiving3: { src: "/images/int-living-3.webp", alt: "Ndenjë me tone të ngrohta dhe dritare horizontale", width: 1800, height: 949, category: "living" },
  intLiving4: { src: "/images/int-living-4.webp", alt: "Ndenjë me mur druri dhe dalje në tarracë", width: 1800, height: 1200, category: "living" },
  intDining: { src: "/images/int-dining.webp", alt: "Zonë ngrënieje me tryezë të errët", width: 1800, height: 1200, category: "living" },
  intDiningGreen: { src: "/images/int-dining-green.webp", alt: "Zonë ngrënieje me karrige të gjelbra", width: 1800, height: 1013, category: "living" },
  intKitchen1: { src: "/images/int-kitchen-1.webp", alt: "Kuzhinë me ishull dhe ndriçim varës", width: 1800, height: 1200, category: "kitchen" },
  intKitchen2: { src: "/images/int-kitchen-2.webp", alt: "Kuzhinë e bardhë me ishull mermeri", width: 1800, height: 1192, category: "kitchen" },
  intKitchen3: { src: "/images/int-kitchen-3.webp", alt: "Kuzhinë kompakte me banak", width: 1800, height: 1196, category: "kitchen" },
  intBedroom1: { src: "/images/int-bedroom-1.webp", alt: "Dhomë gjumi me tone neutrale", width: 1800, height: 1200, category: "bedroom" },
  intBedroom2: { src: "/images/int-bedroom-2.webp", alt: "Dhomë gjumi e ndriçuar natyrshëm", width: 1800, height: 1200, category: "bedroom" },
  intBedroom3: { src: "/images/int-bedroom-3.webp", alt: "Dhomë gjumi me mur të errët dhe parket", width: 1800, height: 1143, category: "bedroom" },
  intBath1: { src: "/images/int-bath-1.webp", alt: "Banjo me vaskë të lirë dhe lavaman", width: 1800, height: 1202, category: "bathroom" },
  intBath2: { src: "/images/int-bath-2.webp", alt: "Banjo me kabinë xhami dhe lavaman druri", width: 1800, height: 1200, category: "bathroom" },
  intBath3: { src: "/images/int-bath-3.webp", alt: "Banjo bashkëkohore me tone të errëta", width: 1200, height: 1800, category: "bathroom" },
  heroPoster: { src: "/images/hero-poster.webp", alt: "Pamje e objektit nga videoja hyrëse", width: 640, height: 354, category: "exterior" },
} satisfies Record<string, SiteImage>;
