/**
 * APARTMENT STATUSES (demonstration values)
 * -----------------------------------------
 * Single editable source of truth for sales status.
 * available = "E lirë", reserved = "E rezervuar", sold = "E shitur".
 * Keys follow the apartment number format: <BUILDING CODE>-<FLOOR><SLOT>.
 */
export type ApartmentStatus = "available" | "reserved" | "sold";

export const apartmentStatus: Record<string, ApartmentStatus> = {
  // Royal Residence
  "RR-101": "reserved", "RR-102": "sold", "RR-103": "available", "RR-104": "sold", "RR-105": "available",
  "RR-201": "reserved", "RR-202": "sold", "RR-203": "available", "RR-204": "sold", "RR-205": "reserved",
  "RR-301": "sold", "RR-302": "sold", "RR-303": "available", "RR-304": "available", "RR-305": "sold",
  "RR-401": "reserved", "RR-402": "available", "RR-403": "available", "RR-404": "available", "RR-405": "available",
  "RR-501": "available", "RR-502": "sold", "RR-503": "available", "RR-504": "reserved", "RR-505": "reserved",
  // Royal Residence 2
  "RR2-101": "sold", "RR2-102": "reserved", "RR2-103": "available", "RR2-104": "sold",
  "RR2-201": "available", "RR2-202": "available", "RR2-203": "reserved", "RR2-204": "available",
  "RR2-301": "sold", "RR2-302": "sold", "RR2-303": "reserved", "RR2-304": "available",
  "RR2-401": "available", "RR2-402": "reserved", "RR2-403": "available", "RR2-404": "available",
  "RR2-501": "reserved", "RR2-502": "available", "RR2-503": "available", "RR2-504": "reserved",
  "RR2-601": "available", "RR2-602": "available", "RR2-603": "available", "RR2-604": "available",
};
