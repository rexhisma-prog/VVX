import { img, type ImageCategory, type SiteImage } from "./images";

export const galleryCategories: { id: ImageCategory | "all"; label: string }[] = [
  { id: "all", label: "Të gjitha" },
  { id: "exterior", label: "Eksterier" },
  { id: "details", label: "Detaje" },
  { id: "living", label: "Ndenja" },
  { id: "kitchen", label: "Kuzhina" },
  { id: "bedroom", label: "Dhoma gjumi" },
  { id: "bathroom", label: "Banjo" },
  { id: "construction", label: "Ndërtimi" },
];

/** Order of photos in the gallery page. */
export const galleryImages: SiteImage[] = [
  img.extLumi,
  img.intLiving1,
  img.extPark,
  img.intKitchen1,
  img.detailGeometry,
  img.intBedroom1,
  img.extUra,
  img.intBath1,
  img.consRebar,
  img.intLiving3,
  img.extFacadeCorner,
  img.intKitchen2,
  img.intDiningGreen,
  img.consCranes,
  img.intBedroom2,
  img.extBalconies,
  img.intBath2,
  img.intLiving4,
  img.consSite,
  img.extWhite,
  img.intKitchen3,
  img.intBedroom3,
  img.intDining,
  img.extFacadeDark,
  img.intBath3,
  img.intLiving2,
  img.consPlans,
];
