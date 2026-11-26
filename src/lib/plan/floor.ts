import type { Building } from "@/data/buildings";
import { getLayout } from "@/data/layouts";
import { placeLayout } from "./geometry";
import type { PlacedLayout, Rect } from "./types";

export interface PlacedUnit {
  slot: string;
  unit: PlacedLayout;
}

const cache = new Map<string, PlacedUnit[]>();

/** All units of a building's typical floor, positioned on the plate. */
export function placedUnits(b: Building): PlacedUnit[] {
  const hit = cache.get(b.id);
  if (hit) return hit;
  const res = b.slots.map((s) => ({
    slot: s.slot,
    unit: placeLayout(getLayout(s.layoutId), s.x, s.y, s.mirrorX, s.mirrorY),
  }));
  cache.set(b.id, res);
  return res;
}

export function plateDepth(b: Building) {
  return b.plate.northDepth + b.plate.corridor + b.plate.southDepth;
}

/** Interior rectangle (without balcony) of a placed unit. */
export function unitRect(u: PlacedLayout): Rect {
  return [u.ox, u.oy, u.w, u.h];
}
