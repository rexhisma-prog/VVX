/**
 * DEMONSTRATION PROJECTS
 * ----------------------
 * All three projects are fictional and exist only to present how
 * VVX Construction could showcase its real developments. Replace names,
 * texts, images and specifications with real data when available.
 */
import { img, type SiteImage } from "./images";

export type ProjectStatus = "construction" | "selling" | "planning";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  construction: "Në ndërtim",
  selling: "Në shitje",
  planning: "Në projektim",
};

export interface Spec {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  buildingId: string;
  name: string;
  tagline: string;
  location: string;
  status: ProjectStatus;
  /** e.g. "P + 5" — ground floor + five residential floors */
  floorsLabel: string;
  floorsCount: number;
  apartmentsCount: number;
  excerpt: string;
  intro: string[];
  hero: SiteImage;
  exterior: SiteImage[];
  interior: SiteImage[];
  specs: Spec[];
  construction: { title: string; text: string }[];
  highlights: string[];
}

export const projects: Project[] = [
  {
    slug: "rezidenca-lumi",
    buildingId: "lumi",
    name: "Rezidenca Lumi",
    tagline: "Banim i qetë me oborr të brendshëm të gjelbëruar",
    location: "Gjakovë · lokacion demonstrues",
    status: "construction",
    floorsLabel: "P + 5",
    floorsCount: 6,
    apartmentsCount: 25,
    excerpt:
      "Objekt banimi me pesë kate rezidenciale, oborr të brendshëm dhe apartamente me ballkone të gjera në fasadën kryesore.",
    intro: [
      "Rezidenca Lumi është projektuar si një objekt banimi me shkallë njerëzore: pesë kate rezidenciale mbi një përdhesë me hapësira afariste, të organizuara rreth një oborri të brendshëm të gjelbëruar.",
      "Apartamentet janë të orientuara drejt dritës natyrore. Çdo njësi ka ballkon në fasadën kryesore, ndërsa ndarja e qartë mes zonës së ditës dhe zonës së natës e bën jetesën të rehatshme për çifte dhe familje.",
    ],
    hero: img.extLumi,
    exterior: [img.extLumi, img.extFacadeCorner, img.extBalconies, img.detailGeometry],
    interior: [img.intLiving1, img.intKitchen1, img.intBedroom1, img.intBath1],
    specs: [
      { label: "Kate", value: "Përdhesë + 5 kate banimi" },
      { label: "Apartamente", value: "25 njësi (1+1, 2+1, 3+1)" },
      { label: "Sipërfaqet", value: "57 – 104 m²" },
      { label: "Përdhesa", value: "Lokale afariste" },
      { label: "Parkimi", value: "Garazh nëntokësor" },
      { label: "Qarkullimi vertikal", value: "Shkallë dhe ashensor" },
    ],
    construction: [
      {
        title: "Struktura",
        text: "Skelet betoni i armuar me pllaka monolite, i projektuar sipas standardeve në fuqi për ndërtime banimi.",
      },
      {
        title: "Fasada",
        text: "Sistem termoizolues i fasadës me veshje dekorative dhe detaje të ballkoneve me parmakë xhami.",
      },
      {
        title: "Dritaret",
        text: "Profile me ndërprerje termike dhe xham të dyfishtë për izolim termik dhe akustik.",
      },
      {
        title: "Instalimet",
        text: "Ngrohje qendrore, instalime elektrike dhe hidraulike të reja, të përgatitura për matje individuale.",
      },
    ],
    highlights: ["Oborr i brendshëm", "Ballkone në çdo apartament", "Garazh nëntokësor"],
  },
  {
    slug: "kompleksi-agimi",
    buildingId: "agimi",
    name: "Kompleksi Agimi",
    tagline: "Arkitekturë e pastër, hapësira të ndriçuara",
    location: "Gjakovë · lokacion demonstrues",
    status: "selling",
    floorsLabel: "P + 6",
    floorsCount: 7,
    apartmentsCount: 24,
    excerpt:
      "Objekt kompakt me katër apartamente për kat, ku secili apartament ka të paktën dy fasada dhe ballkon të vazhdueshëm.",
    intro: [
      "Kompleksi Agimi ndjek një koncept të thjeshtë: më pak apartamente për kat dhe më shumë dritë për secilin prej tyre. Me katër njësi për kat, çdo apartament ka pozitë këndore dhe ajrosje nga dy anë.",
      "Fasada e bardhë me ballkone të shkallëzuara krijon hije natyrore gjatë verës dhe një siluetë të qetë e bashkëkohore në lagje.",
    ],
    hero: img.extPark,
    exterior: [img.extPark, img.extWhite, img.extFacadeDark, img.consCranes],
    interior: [img.intLiving3, img.intDiningGreen, img.intKitchen2, img.intBedroom2, img.intBath3],
    specs: [
      { label: "Kate", value: "Përdhesë + 6 kate banimi" },
      { label: "Apartamente", value: "24 njësi (1+1, 2+1, 3+1)" },
      { label: "Sipërfaqet", value: "70 – 104 m²" },
      { label: "Apartamente për kat", value: "4 njësi këndore" },
      { label: "Parkimi", value: "Parking i jashtëm dhe nëntokësor" },
      { label: "Qarkullimi vertikal", value: "Shkallë dhe ashensor" },
    ],
    construction: [
      {
        title: "Struktura",
        text: "Skelet betoni i armuar me mure bërthame për shkallët dhe ashensorin, që rrisin qëndrueshmërinë e objektit.",
      },
      {
        title: "Izolimi",
        text: "Izolim termik i vazhdueshëm në fasadë dhe izolim akustik mes kateve dhe apartamenteve.",
      },
      {
        title: "Ballkonet",
        text: "Ballkone të thella me parmakë xhami, të projektuara si hapësirë e plotë e jetesës gjatë stinës së ngrohtë.",
      },
      {
        title: "Hapësirat e përbashkëta",
        text: "Hyrje e ndriçuar natyrshëm, korridore me materiale rezistente dhe ndriçim me sensor lëvizjeje.",
      },
    ],
    highlights: ["4 apartamente për kat", "Ajrosje nga dy anë", "Ballkone të thella"],
  },
  {
    slug: "rezidenca-kroi",
    buildingId: "kroi",
    name: "Rezidenca Kroi",
    tagline: "Fasadë e errët, interier i ngrohtë",
    location: "Gjakovë · lokacion demonstrues",
    status: "planning",
    floorsLabel: "P + 4",
    floorsCount: 5,
    apartmentsCount: 20,
    excerpt:
      "Objekt urban me fasadë të errët dhe hapje të mëdha xhami. Apartamente funksionale me korridore të qarta dhe hapësira shërbimi.",
    intro: [
      "Rezidenca Kroi është menduar për një parcelë urbane ku fasada duhet të jetë njëkohësisht e qetë dhe me karakter. Veshja e errët dhe dritaret e mëdha krijojnë kontrast të fortë me interierin e ngrohtë.",
      "Çdo apartament ka korridor të qartë që ndan zonën e ditës nga dhomat e gjumit, si dhe hapësira të veçanta për lavanderi dhe depo.",
    ],
    hero: img.extUra,
    exterior: [img.extUra, img.extFacadeDark, img.extBalconies, img.consPlans],
    interior: [img.intLiving4, img.intKitchen3, img.intBedroom3, img.intBath2, img.intDining, img.intLiving2],
    specs: [
      { label: "Kate", value: "Përdhesë + 4 kate banimi" },
      { label: "Apartamente", value: "20 njësi (1+1, 2+1, 3+1)" },
      { label: "Sipërfaqet", value: "61 – 101 m²" },
      { label: "Përdhesa", value: "Hyrje, depo dhe hapësira teknike" },
      { label: "Parkimi", value: "Garazh nëntokësor" },
      { label: "Qarkullimi vertikal", value: "Shkallë dhe ashensor" },
    ],
    construction: [
      {
        title: "Struktura",
        text: "Skelet betoni i armuar me hapësira strukturore që lejojnë fleksibilitet në organizimin e apartamenteve.",
      },
      {
        title: "Fasada",
        text: "Veshje e ventiluar me panele të errëta dhe korniza të theksuara rreth dritareve.",
      },
      {
        title: "Energjia",
        text: "Projektim i orientuar drejt efiçiencës: izolim i plotë, dritare me performancë të lartë dhe ndriçim LED në hapësirat e përbashkëta.",
      },
      {
        title: "Përfundimet",
        text: "Dysheme me parket në dhomat e ndenjjes dhe të gjumit, pllaka qeramike me format të madh në banjo.",
      },
    ],
    highlights: ["Fasadë e ventiluar", "Lavanderi në çdo apartament", "Korridore të qarta"],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
