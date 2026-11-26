import type {
  Furniture,
  Opening,
  PlacedLayout,
  Rect,
  Room,
  UnitLayout,
  WallKind,
  WallSegment,
} from "./types";

const EPS = 0.001;
const round = (n: number) => Math.round(n * 1000) / 1000;

export const WALL_THICKNESS: Record<WallKind, number> = {
  ext: 0.3,
  int: 0.12,
  rail: 0.05,
};

/* ------------------------------------------------------------------ areas */

export function rectArea(r: Rect) {
  return r[2] * r[3];
}

export function roomArea(room: Room) {
  return Math.round(room.parts.reduce((s, p) => s + rectArea(p), 0) * 100) / 100;
}

export function interiorArea(layout: UnitLayout) {
  return (
    Math.round(
      layout.rooms
        .filter((r) => r.kind !== "balcony")
        .reduce((s, r) => s + roomArea(r), 0) * 10,
    ) / 10
  );
}

export function balconyArea(layout: UnitLayout) {
  return (
    Math.round(
      layout.rooms
        .filter((r) => r.kind === "balcony")
        .reduce((s, r) => s + roomArea(r), 0) * 10,
    ) / 10
  );
}

/** Overall dimensions of a room as "a × b" (bounding box). */
export function roomDims(room: Room) {
  const b = bbox(room.parts);
  return [b[2], b[3]] as const;
}

export function bbox(rects: Rect[]): Rect {
  let x1 = Infinity,
    y1 = Infinity,
    x2 = -Infinity,
    y2 = -Infinity;
  for (const [x, y, w, h] of rects) {
    x1 = Math.min(x1, x);
    y1 = Math.min(y1, y);
    x2 = Math.max(x2, x + w);
    y2 = Math.max(y2, y + h);
  }
  return [x1, y1, x2 - x1, y2 - y1];
}

export function layoutBounds(layout: UnitLayout): Rect {
  return bbox(layout.rooms.flatMap((r) => r.parts));
}

export function roomLabelPoint(room: Room): [number, number] {
  if (room.label) return room.label;
  // centre of the largest part
  const p = [...room.parts].sort((a, b) => rectArea(b) - rectArea(a))[0];
  return [p[0] + p[2] / 2, p[1] + p[3] / 2];
}

/* ------------------------------------------------------------- transforms */

interface Xform {
  mx: boolean;
  my: boolean;
  W: number;
  H: number;
  dx: number;
  dy: number;
}

function tRect([x, y, w, h]: Rect, t: Xform): Rect {
  const nx = t.mx ? t.W - x - w : x;
  const ny = t.my ? t.H - y - h : y;
  return [round(nx + t.dx), round(ny + t.dy), w, h];
}

function tPoint([x, y]: [number, number], t: Xform): [number, number] {
  return [round((t.mx ? t.W - x : x) + t.dx), round((t.my ? t.H - y : y) + t.dy)];
}

const flipHinge = (h: Opening["hinge"]) => (h === "end" ? "start" : "end");

function tOpening(op: Opening, t: Xform): Opening {
  let { x, y, swing, hinge } = op;
  const { w, o } = op;
  if (o === "h") {
    if (t.mx) {
      x = t.W - x - w;
      hinge = flipHinge(hinge);
    }
    if (t.my) {
      y = t.H - y;
      if (swing) swing = (swing * -1) as 1 | -1;
    }
  } else {
    if (t.mx) {
      x = t.W - x;
      if (swing) swing = (swing * -1) as 1 | -1;
    }
    if (t.my) {
      y = t.H - y - w;
      hinge = flipHinge(hinge);
    }
  }
  return { ...op, x: round(x + t.dx), y: round(y + t.dy), swing, hinge };
}

function tFurniture(f: Furniture, t: Xform): Furniture {
  const [x, y] = tRect([f.x, f.y, f.w, f.h], t);
  let rot = f.rot ?? 0;
  if (t.mx && (rot === 90 || rot === 270)) rot = rot === 90 ? 270 : 90;
  if (t.my && (rot === 0 || rot === 180)) rot = rot === 0 ? 180 : 0;
  return { ...f, x, y, rot: rot as Furniture["rot"] };
}

/** Mirror (optionally) and translate a layout onto a floor plate. */
export function placeLayout(
  layout: UnitLayout,
  ox: number,
  oy: number,
  mirrorX = false,
  mirrorY = false,
): PlacedLayout {
  const t: Xform = { mx: mirrorX, my: mirrorY, W: layout.w, H: layout.h, dx: ox, dy: oy };
  return {
    ...layout,
    ox,
    oy,
    facades: mirrorX
      ? { left: layout.facades.right, right: layout.facades.left }
      : layout.facades,
    rooms: layout.rooms.map((r) => ({
      ...r,
      parts: r.parts.map((p) => tRect(p, t)),
      label: r.label ? tPoint(r.label, t) : undefined,
    })),
    openings: layout.openings.map((o) => tOpening(o, t)),
    furniture: layout.furniture.map((f) => tFurniture(f, t)),
  };
}

/* ------------------------------------------------------------------ walls */

function roomAt(rooms: Room[], px: number, py: number): Room | null {
  for (const r of rooms) {
    for (const [x, y, w, h] of r.parts) {
      if (px > x + EPS && px < x + w - EPS && py > y + EPS && py < y + h - EPS) return r;
    }
  }
  return null;
}

function classify(a: Room | null, b: Room | null): WallKind | null {
  if (a === b) return null;
  if (!a || !b) {
    const r = (a ?? b)!;
    return r.kind === "balcony" ? "rail" : "ext";
  }
  const ab = a.kind === "balcony";
  const bb = b.kind === "balcony";
  if (ab && bb) return "rail";
  if (ab || bb) return "ext";
  return "int";
}

/**
 * Derive wall segments from room rectangles: every room edge is split at all
 * breakpoints and classified by what lies on either side of it.
 */
export function computeWalls(rooms: Room[]): WallSegment[] {
  const parts = rooms.flatMap((r) => r.parts);
  const xs = [...new Set(parts.flatMap(([x, , w]) => [round(x), round(x + w)]))].sort(
    (a, b) => a - b,
  );
  const ys = [...new Set(parts.flatMap(([, y, , h]) => [round(y), round(y + h)]))].sort(
    (a, b) => a - b,
  );
  const segs: WallSegment[] = [];

  const push = (o: "h" | "v", c: number, a: number, b: number, kind: WallKind) => {
    const last = segs[segs.length - 1];
    if (last && last.o === o && last.c === c && last.kind === kind && Math.abs(last.b - a) < EPS) {
      last.b = b;
    } else segs.push({ o, c, a, b, kind });
  };

  // horizontal lines
  for (const y of ys) {
    for (let i = 0; i < xs.length - 1; i++) {
      const a = xs[i],
        b = xs[i + 1];
      const onEdge = parts.some(
        ([px, py, pw, ph]) =>
          (Math.abs(py - y) < EPS || Math.abs(py + ph - y) < EPS) &&
          px <= a + EPS &&
          px + pw >= b - EPS,
      );
      if (!onEdge) continue;
      const m = (a + b) / 2;
      const kind = classify(roomAt(rooms, m, y - 0.01), roomAt(rooms, m, y + 0.01));
      if (kind) push("h", y, a, b, kind);
    }
  }
  // vertical lines
  for (const x of xs) {
    for (let i = 0; i < ys.length - 1; i++) {
      const a = ys[i],
        b = ys[i + 1];
      const onEdge = parts.some(
        ([px, py, pw, ph]) =>
          (Math.abs(px - x) < EPS || Math.abs(px + pw - x) < EPS) &&
          py <= a + EPS &&
          py + ph >= b - EPS,
      );
      if (!onEdge) continue;
      const m = (a + b) / 2;
      const kind = classify(roomAt(rooms, x - 0.01, m), roomAt(rooms, x + 0.01, m));
      if (kind) push("v", x, a, b, kind);
    }
  }
  return segs;
}

/** Rectangles to fill for a wall segment, with openings cut out. */
export function wallPieces(seg: WallSegment, openings: Opening[]): Rect[] {
  const t = WALL_THICKNESS[seg.kind];
  const ext = seg.kind === "rail" ? 0 : t / 2;
  let intervals: [number, number][] = [[seg.a - ext, seg.b + ext]];
  for (const op of openings) {
    if (op.o !== seg.o) continue;
    const line = op.o === "h" ? op.y : op.x;
    if (Math.abs(line - seg.c) > 0.02) continue;
    const s = op.o === "h" ? op.x : op.y;
    const e = s + op.w;
    const next: [number, number][] = [];
    for (const [a, b] of intervals) {
      if (e <= a || s >= b) {
        next.push([a, b]);
        continue;
      }
      if (s > a) next.push([a, s]);
      if (e < b) next.push([e, b]);
    }
    intervals = next;
  }
  return intervals
    .filter(([a, b]) => b - a > 0.005)
    .map(([a, b]) =>
      seg.o === "h" ? [a, seg.c - t / 2, b - a, t] : [seg.c - t / 2, a, t, b - a],
    );
}

/** Thickness of the wall an opening sits in (used to draw frames). */
export function openingWallThickness(op: Opening, walls: WallSegment[]) {
  const s = op.o === "h" ? op.x : op.y;
  const mid = s + op.w / 2;
  const line = op.o === "h" ? op.y : op.x;
  const w = walls.find(
    (seg) => seg.o === op.o && Math.abs(seg.c - line) < 0.02 && seg.a <= mid && seg.b >= mid,
  );
  return w ? WALL_THICKNESS[w.kind] : WALL_THICKNESS.int;
}
