/**
 * APARTMENT STATUSES (demonstration values)
 * -----------------------------------------
 * Single editable source of truth for sales status.
 * available = "E lirë", reserved = "E rezervuar", sold = "E shitur".
 * Keys follow the apartment number format: <BUILDING CODE>-<FLOOR><SLOT>.
 */
export type ApartmentStatus = "available" | "reserved" | "sold";

export const apartmentStatus: Record<string, ApartmentStatus> = {
  // LU
  "LU-101": "reserved", "LU-102": "sold", "LU-103": "available", "LU-104": "sold", "LU-105": "available",
  "LU-201": "reserved", "LU-202": "sold", "LU-203": "available", "LU-204": "sold", "LU-205": "reserved",
  "LU-301": "sold", "LU-302": "sold", "LU-303": "available", "LU-304": "available", "LU-305": "sold",
  "LU-401": "reserved", "LU-402": "available", "LU-403": "available", "LU-404": "available", "LU-405": "available",
  "LU-501": "available", "LU-502": "sold", "LU-503": "available", "LU-504": "reserved", "LU-505": "reserved",
  // AG
  "AG-101": "sold", "AG-102": "reserved", "AG-103": "available", "AG-104": "sold",
  "AG-201": "available", "AG-202": "available", "AG-203": "reserved", "AG-204": "available",
  "AG-301": "sold", "AG-302": "sold", "AG-303": "reserved", "AG-304": "available",
  "AG-401": "available", "AG-402": "reserved", "AG-403": "available", "AG-404": "available",
  "AG-501": "reserved", "AG-502": "available", "AG-503": "available", "AG-504": "reserved",
  "AG-601": "available", "AG-602": "available", "AG-603": "available", "AG-604": "available",
  // KR
  "KR-101": "available", "KR-102": "available", "KR-103": "reserved", "KR-104": "available", "KR-105": "available",
  "KR-201": "reserved", "KR-202": "available", "KR-203": "sold", "KR-204": "available", "KR-205": "available",
  "KR-301": "available", "KR-302": "available", "KR-303": "available", "KR-304": "available", "KR-305": "available",
  "KR-401": "available", "KR-402": "available", "KR-403": "available", "KR-404": "available", "KR-405": "available",
};
