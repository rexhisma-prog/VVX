/**
 * Apartment inventory, derived from buildings × floors × slots.
 * Statuses come from apartment-status.ts; layouts from layouts.ts.
 */
import { buildings, type Building, type UnitSlot } from "./buildings";
import { apartmentStatus, type ApartmentStatus } from "./apartment-status";
import { getLayout } from "./layouts";
import { balconyArea, interiorArea } from "@/lib/plan/geometry";
import type { UnitLayout } from "@/lib/plan/types";

export interface Apartment {
  /** e.g. "RR-302" */
  number: string;
  /** URL segment, e.g. "rr-302" */
  slug: string;
  buildingId: string;
  projectSlug: string;
  floor: number;
  slot: UnitSlot;
  layout: UnitLayout;
  area: number;
  balcony: number;
  status: ApartmentStatus;
}

export const STATUS_LABEL: Record<ApartmentStatus, string> = {
  available: "E lirë",
  reserved: "E rezervuar",
  sold: "E shitur",
};

export const STATUS_ORDER: ApartmentStatus[] = ["available", "reserved", "sold"];

function build(b: Building): Apartment[] {
  return b.floors.flatMap((floor) =>
    b.slots.map((slot) => {
      const layout = getLayout(slot.layoutId);
      const number = `${b.code}-${floor}${slot.slot}`;
      return {
        number,
        slug: number.toLowerCase(),
        buildingId: b.id,
        projectSlug: b.projectSlug,
        floor,
        slot,
        layout,
        area: interiorArea(layout),
        balcony: balconyArea(layout),
        status: apartmentStatus[number] ?? "available",
      };
    }),
  );
}

export const apartments: Apartment[] = buildings.flatMap(build);

export const apartmentsByBuilding = (buildingId: string) =>
  apartments.filter((a) => a.buildingId === buildingId);

export const apartmentsOnFloor = (buildingId: string, floor: number) =>
  apartments.filter((a) => a.buildingId === buildingId && a.floor === floor);

export const getApartment = (projectSlug: string, slug: string) =>
  apartments.find((a) => a.projectSlug === projectSlug && a.slug === slug);

export function floorLabel(floor: number) {
  return floor === 0 ? "Përdhesa" : `Kati ${floor}`;
}

export function bedroomsLabel(n: number) {
  return n === 1 ? "1 dhomë gjumi" : `${n} dhoma gjumi`;
}

export function formatArea(n: number) {
  // deterministic formatting (identical on server and client): 83,6 m²
  return `${n.toFixed(1).replace(".", ",")} m²`;
}
