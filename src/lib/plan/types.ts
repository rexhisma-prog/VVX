/**
 * Floor-plan data model.
 *
 * All geometry is expressed in METRES, in a local coordinate system where
 * x grows to the right and y grows downwards (same as SVG).
 *
 * A unit layout is drawn with its main facade on the TOP edge (y = 0) and its
 * entrance door on the BOTTOM edge (y = h). Balconies sit above the facade
 * (negative y). When a layout is placed on a floor it can be mirrored
 * horizontally and/or vertically, so one drawing serves several positions.
 *
 * Room rectangles are measured to wall centre-lines. Walls are generated
 * automatically from the room geometry (see geometry.ts), so to edit a plan
 * you only move rooms, openings and furniture.
 */

/** [x, y, width, height] in metres */
export type Rect = [number, number, number, number];

export type RoomKind =
  | "living"
  | "kitchen"
  | "bedroom"
  | "bath"
  | "wc"
  | "hall"
  | "storage"
  | "laundry"
  | "balcony";

export interface Room {
  id: string;
  name: string;
  kind: RoomKind;
  /** One or more rectangles; several rectangles form an L-shaped / open-plan room. */
  parts: Rect[];
  /** Optional label anchor (defaults to the centre of the first part). */
  label?: [number, number];
}

export type OpeningKind = "door" | "entry" | "window" | "slider" | "passage";

/**
 * Openings sit on a wall line.
 * - o = "h": wall is horizontal at y; the opening spans x .. x + w
 * - o = "v": wall is vertical at x; the opening spans y .. y + w
 * Doors: `swing` is the side (+1 / -1 along the perpendicular axis) the leaf
 * opens into; `hinge` says which end of the opening carries the hinge.
 */
export interface Opening {
  kind: OpeningKind;
  o: "h" | "v";
  x: number;
  y: number;
  w: number;
  swing?: 1 | -1;
  hinge?: "start" | "end";
}

export type FurnitureType =
  | "bed-double"
  | "bed-single"
  | "nightstand"
  | "wardrobe"
  | "sofa"
  | "sofa-l"
  | "armchair"
  | "coffee-table"
  | "tv"
  | "dining"
  | "kitchen"
  | "counter"
  | "fridge"
  | "wc"
  | "basin"
  | "shower"
  | "bathtub"
  | "washer"
  | "desk"
  | "plant"
  | "rug"
  | "shelf"
  | "lounger"
  | "outdoor-table";

/**
 * Furniture is described by its final bounding box on the plan.
 * `rot` says where the "back" of the object is: 0 = top, 90 = right,
 * 180 = bottom, 270 = left.
 */
export interface Furniture {
  t: FurnitureType;
  x: number;
  y: number;
  w: number;
  h: number;
  rot?: 0 | 90 | 180 | 270;
}

export interface UnitLayout {
  id: string;
  /** Commercial name of the type, e.g. "Tipi A2" */
  name: string;
  /** Local typology notation, e.g. "2+1" */
  typology: string;
  bedrooms: number;
  bathrooms: number;
  /** Interior footprint (excluding balcony) */
  w: number;
  h: number;
  /** Which sides are exterior facades (top is always a facade). */
  facades: { left?: boolean; right?: boolean };
  rooms: Room[];
  openings: Opening[];
  furniture: Furniture[];
  description: string;
}

/** A layout transformed and positioned on a floor plate. */
export interface PlacedLayout extends UnitLayout {
  /** offset of the unit on the floor plate */
  ox: number;
  oy: number;
}

export type WallKind = "ext" | "int" | "rail";

export interface WallSegment {
  o: "h" | "v";
  /** line coordinate (y for horizontal, x for vertical) */
  c: number;
  a: number;
  b: number;
  kind: WallKind;
}
