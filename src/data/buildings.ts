/**
 * DEMONSTRATION BUILDINGS, FLOORS AND APARTMENT SLOTS
 * ---------------------------------------------------
 * A building has a typical floor plate made of "slots". Each slot places a
 * layout (from layouts.ts) at a position on the plate, optionally mirrored.
 * Every residential floor repeats the plate, which produces the apartment
 * inventory (see apartments.ts).
 *
 * Plate geometry (metres):
 *   north row  y = 0 .. northDepth           (facade on top)
 *   corridor   y = northDepth .. + corridor
 *   south row  y = .. + southDepth            (facade at the bottom)
 */
export interface UnitSlot {
  /** two-digit position code used in apartment numbers, e.g. "03" */
  slot: string;
  layoutId: string;
  x: number;
  y: number;
  mirrorX?: boolean;
  mirrorY?: boolean;
}

export interface Building {
  id: string;
  projectSlug: string;
  /** short code used in apartment numbers, e.g. "RR" → RR-302 */
  code: string;
  name: string;
  /** residential floors (1 = first floor above the ground floor) */
  floors: number[];
  plate: {
    width: number;
    northDepth: number;
    corridor: number;
    southDepth: number;
  };
  /** stair & lift core, positioned in the south row */
  core: { x: number; w: number };
  slots: UnitSlot[];
}

export const buildings: Building[] = [
  {
    id: "royal-1",
    projectSlug: "royal-residence",
    code: "RR",
    name: "Royal Residence",
    floors: [1, 2, 3, 4, 5],
    plate: { width: 29.6, northDepth: 7.6, corridor: 1.8, southDepth: 8.4 },
    core: { x: 12.4, w: 4.8 },
    slots: [
      { slot: "01", layoutId: "lumi-a2", x: 0, y: 0 },
      { slot: "02", layoutId: "lumi-a1", x: 11.0, y: 0 },
      { slot: "03", layoutId: "lumi-a2", x: 18.6, y: 0, mirrorX: true },
      { slot: "04", layoutId: "lumi-a3", x: 0, y: 9.4, mirrorY: true },
      { slot: "05", layoutId: "lumi-a3", x: 17.2, y: 9.4, mirrorX: true, mirrorY: true },
    ],
  },
  {
    id: "royal-2",
    projectSlug: "royal-residence-2",
    code: "RR2",
    name: "Royal Residence 2",
    floors: [1, 2, 3, 4, 5, 6],
    plate: { width: 24.0, northDepth: 8.0, corridor: 1.8, southDepth: 7.6 },
    core: { x: 9.2, w: 5.6 },
    slots: [
      { slot: "01", layoutId: "agimi-b3", x: 0, y: 0 },
      { slot: "02", layoutId: "agimi-b2", x: 13.0, y: 0, mirrorX: true },
      { slot: "03", layoutId: "agimi-b1", x: 0, y: 9.8, mirrorY: true },
      { slot: "04", layoutId: "agimi-b1", x: 14.8, y: 9.8, mirrorX: true, mirrorY: true },
    ],
  },
];

export function getBuilding(id: string) {
  return buildings.find((b) => b.id === id);
}

export function getBuildingByProject(slug: string) {
  return buildings.find((b) => b.projectSlug === slug);
}
