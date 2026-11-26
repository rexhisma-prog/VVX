/**
 * Low-level SVG building blocks for architectural floor plans.
 * Pure render functions (no hooks) — usable from server and client components.
 */
import type { Opening, PlacedLayout, Rect, Room, WallSegment } from "@/lib/plan/types";
import {
  computeWalls,
  openingWallThickness,
  roomArea,
  roomDims,
  roomLabelPoint,
  wallPieces,
} from "@/lib/plan/geometry";
import { FurnitureItem } from "./symbols";

const fmt = (n: number) => n.toFixed(2);
const fmtArea = (n: number) => n.toFixed(1).replace(".", ",");

/* ------------------------------------------------------------------ defs */

export function PlanDefs({ id }: { id: string }) {
  return (
    <defs>
      <pattern id={`${id}-tile`} width="0.3" height="0.3" patternUnits="userSpaceOnUse">
        <rect width="0.3" height="0.3" fill="var(--fp-wet)" />
        <path d="M 0.3 0 L 0 0 0 0.3" fill="none" stroke="var(--fp-tile-line)" strokeWidth="0.008" />
      </pattern>
      <pattern id={`${id}-deck`} width="0.16" height="1" patternUnits="userSpaceOnUse">
        <rect width="0.16" height="1" fill="var(--fp-deck)" />
        <line x1="0" y1="0" x2="0" y2="1" stroke="var(--fp-deck-line)" strokeWidth="0.01" />
      </pattern>
      <pattern
        id={`${id}-hatch`}
        width="0.25"
        height="0.25"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <rect width="0.25" height="0.25" fill="var(--fp-core)" />
        <line x1="0" y1="0" x2="0" y2="0.25" stroke="var(--fp-core-line)" strokeWidth="0.02" />
      </pattern>
    </defs>
  );
}

export function roomFill(room: Room, id: string) {
  switch (room.kind) {
    case "bath":
    case "wc":
    case "laundry":
      return `url(#${id}-tile)`;
    case "balcony":
      return `url(#${id}-deck)`;
    case "hall":
    case "storage":
      return "var(--fp-hall)";
    case "bedroom":
      return "var(--fp-bed)";
    default:
      return "var(--fp-living)";
  }
}

/* ---------------------------------------------------------------- pieces */

export function RoomFills({ unit, id }: { unit: PlacedLayout; id: string }) {
  return (
    <g>
      {unit.rooms.map((r) =>
        r.parts.map((p, i) => (
          <rect
            key={`${r.id}-${i}`}
            x={p[0]}
            y={p[1]}
            width={p[2]}
            height={p[3]}
            fill={roomFill(r, id)}
          />
        )),
      )}
    </g>
  );
}

export function Walls({ walls, openings }: { walls: WallSegment[]; openings: Opening[] }) {
  return (
    <g>
      {walls.map((seg, i) =>
        wallPieces(seg, openings).map((p, j) => (
          <rect
            key={`${i}-${j}`}
            x={p[0]}
            y={p[1]}
            width={p[2]}
            height={p[3]}
            className={seg.kind === "rail" ? "fp-rail" : "fp-wall"}
          />
        )),
      )}
    </g>
  );
}

function arcSweep(hx: number, hy: number, jx: number, jy: number, tx: number, ty: number) {
  const cross = (jx - hx) * (ty - hy) - (jy - hy) * (tx - hx);
  return cross > 0 ? 1 : 0;
}

export function OpeningShape({ op, t }: { op: Opening; t: number }) {
  const { o, x, y, w } = op;
  if (op.kind === "passage") return null;

  if (op.kind === "window" || op.kind === "slider") {
    const frame: Rect = o === "h" ? [x, y - t / 2, w, t] : [x - t / 2, y, t, w];
    if (op.kind === "window") {
      return (
        <g className="fp-window">
          <rect x={frame[0]} y={frame[1]} width={frame[2]} height={frame[3]} />
          {o === "h" ? (
            <>
              <line x1={x} y1={y - 0.03} x2={x + w} y2={y - 0.03} />
              <line x1={x} y1={y + 0.03} x2={x + w} y2={y + 0.03} />
            </>
          ) : (
            <>
              <line x1={x - 0.03} y1={y} x2={x - 0.03} y2={y + w} />
              <line x1={x + 0.03} y1={y} x2={x + 0.03} y2={y + w} />
            </>
          )}
        </g>
      );
    }
    // sliding door: two overlapping leaves
    const l = w * 0.55;
    return (
      <g className="fp-window">
        <rect x={frame[0]} y={frame[1]} width={frame[2]} height={frame[3]} />
        {o === "h" ? (
          <>
            <rect x={x} y={y - 0.06} width={l} height={0.05} className="fp-leaf" />
            <rect x={x + w - l} y={y + 0.01} width={l} height={0.05} className="fp-leaf" />
          </>
        ) : (
          <>
            <rect x={x - 0.06} y={y} width={0.05} height={l} className="fp-leaf" />
            <rect x={x + 0.01} y={y + w - l} width={0.05} height={l} className="fp-leaf" />
          </>
        )}
      </g>
    );
  }

  // hinged doors
  const s = op.swing ?? 1;
  let hx: number, hy: number, jx: number, jy: number, tx: number, ty: number;
  if (o === "h") {
    hx = op.hinge === "end" ? x + w : x;
    hy = y;
    jx = op.hinge === "end" ? x : x + w;
    jy = y;
    tx = hx;
    ty = y + s * w;
  } else {
    hy = op.hinge === "end" ? y + w : y;
    hx = x;
    jy = op.hinge === "end" ? y : y + w;
    jx = x;
    tx = x + s * w;
    ty = hy;
  }
  const sweep = arcSweep(hx, hy, jx, jy, tx, ty);
  const leafW = op.kind === "entry" ? 0.06 : 0.04;
  return (
    <g>
      <path d={`M ${jx} ${jy} A ${w} ${w} 0 0 ${sweep} ${tx} ${ty}`} className="fp-swing" />
      <line
        x1={hx}
        y1={hy}
        x2={tx}
        y2={ty}
        className="fp-door"
        strokeWidth={leafW}
        strokeLinecap="butt"
      />
      {op.kind === "entry" && (
        <rect
          x={o === "h" ? x : x - t / 2}
          y={o === "h" ? y - t / 2 : y}
          width={o === "h" ? w : t}
          height={o === "h" ? t : w}
          className="fp-threshold"
        />
      )}
    </g>
  );
}

export function Openings({ unit, walls }: { unit: PlacedLayout; walls: WallSegment[] }) {
  return (
    <g>
      {unit.openings.map((op, i) => (
        <OpeningShape key={i} op={op} t={openingWallThickness(op, walls)} />
      ))}
    </g>
  );
}

export function FurnitureLayer({ unit, faint = false }: { unit: PlacedLayout; faint?: boolean }) {
  return (
    <g className={faint ? "fp-furn fp-furn-faint" : "fp-furn"}>
      {unit.furniture.map((f, i) => (
        <FurnitureItem key={i} item={f} />
      ))}
    </g>
  );
}

export function RoomLabels({
  unit,
  detailed = true,
  scale = 1,
}: {
  unit: PlacedLayout;
  detailed?: boolean;
  scale?: number;
}) {
  return (
    <g className="fp-labels">
      {unit.rooms.map((r) => {
        const [lx, ly] = roomLabelPoint(r);
        const [dw, dh] = roomDims(r);
        const small = Math.min(dw, dh) < 1.5 || roomArea(r) < 4;
        const k = (small ? 0.78 : 1) * scale;
        return (
          <g key={r.id} transform={`translate(${lx} ${ly})`}>
            <rect
              x={-1.25 * k}
              y={-0.33 * k}
              width={2.5 * k}
              height={(detailed ? 0.92 : 0.55) * k}
              className="fp-label-bg"
              rx={0.06}
            />
            <text className="fp-room-name" fontSize={0.2 * k} y={-0.08 * k} textAnchor="middle">
              {r.name.toUpperCase()}
            </text>
            <text className="fp-room-area" fontSize={0.25 * k} y={0.2 * k} textAnchor="middle">
              {fmtArea(roomArea(r))} m²
            </text>
            {detailed && (
              <text className="fp-room-dims" fontSize={0.165 * k} y={0.46 * k} textAnchor="middle">
                {fmt(dw)} × {fmt(dh)}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

/** Complete drawing of one apartment (fills, furniture, walls, openings, labels). */
export function UnitDrawing({
  unit,
  id,
  furniture = true,
  faintFurniture = false,
  labels = "detailed",
  labelScale = 1,
  tint,
}: {
  unit: PlacedLayout;
  id: string;
  furniture?: boolean;
  faintFurniture?: boolean;
  labels?: "detailed" | "simple" | "none";
  labelScale?: number;
  /** optional overlay colour drawn above floors, below furniture & walls */
  tint?: React.ReactNode;
}) {
  const walls = computeWalls(unit.rooms);
  return (
    <g>
      <RoomFills unit={unit} id={id} />
      {tint}
      {furniture && <FurnitureLayer unit={unit} faint={faintFurniture} />}
      <Walls walls={walls} openings={unit.openings} />
      <Openings unit={unit} walls={walls} />
      {labels !== "none" && (
        <RoomLabels unit={unit} detailed={labels === "detailed"} scale={labelScale} />
      )}
    </g>
  );
}

/* --------------------------------------------------------- core & extras */

/** Stair + lift core in the south row, open towards the corridor above it. */
export function CoreDrawing({
  x,
  y,
  w,
  h,
  id,
  labels = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  labels?: boolean;
}) {
  const t = 0.25;
  const liftW = 1.7;
  const stairX = x + 0.2;
  const stairW = w - liftW - 0.75;
  const flight = (stairW - 0.15) / 2;
  const landing = 1.4;
  const treadsTop = y + landing;
  const treadsBottom = y + h - 1.3;
  const treads: number[] = [];
  for (let ty = treadsTop; ty <= treadsBottom + 0.001; ty += 0.28) treads.push(ty);
  const liftX = x + w - liftW - 0.3;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="var(--fp-hall)" />
      {/* stairs */}
      <g className="fp-stair">
        {treads.map((ty, i) => (
          <g key={i}>
            <line x1={stairX} y1={ty} x2={stairX + flight} y2={ty} />
            <line x1={stairX + flight + 0.15} y1={ty} x2={stairX + stairW} y2={ty} />
          </g>
        ))}
        <rect x={stairX + flight} y={treadsTop} width={0.15} height={treadsBottom - treadsTop + 0.6} className="fp-wall" />
        <rect x={stairX} y={treadsTop} width={stairW} height={h - landing - 0.12} fill="none" />
        <path
          d={`M ${stairX + flight / 2} ${treadsBottom} L ${stairX + flight / 2} ${treadsBottom + 0.55} L ${stairX + flight * 1.5 + 0.15} ${treadsBottom + 0.55} L ${stairX + flight * 1.5 + 0.15} ${treadsTop + 0.3}`}
          fill="none"
          className="fp-arrow"
        />
        <path
          d={`M ${stairX + flight * 1.5 + 0.03} ${treadsTop + 0.5} L ${stairX + flight * 1.5 + 0.15} ${treadsTop + 0.3} L ${stairX + flight * 1.5 + 0.27} ${treadsTop + 0.5}`}
          fill="none"
          className="fp-arrow"
        />
      </g>
      {/* lift + shaft */}
      <rect x={liftX} y={y + 0.35} width={liftW} height={1.8} fill={`url(#${id}-hatch)`} className="fp-core-box" />
      <rect x={liftX + 0.2} y={y + 0.55} width={liftW - 0.4} height={1.4} className="fp-lift" />
      <line x1={liftX + 0.2} y1={y + 0.55} x2={liftX + liftW - 0.2} y2={y + 1.95} className="fp-faint-line" />
      <line x1={liftX + liftW - 0.2} y1={y + 0.55} x2={liftX + 0.2} y2={y + 1.95} className="fp-faint-line" />
      <rect x={liftX} y={y + 2.45} width={liftW} height={1.1} fill={`url(#${id}-hatch)`} className="fp-core-box" />
      {/* core walls (open to the corridor on top) */}
      <rect x={x - t / 2} y={y} width={t} height={h} className="fp-wall" />
      <rect x={x + w - t / 2} y={y} width={t} height={h} className="fp-wall" />
      <rect x={x - t / 2} y={y + h - 0.15} width={w + t} height={0.3} className="fp-wall" />
      {labels && (
        <g className="fp-labels">
          <text x={stairX + stairW / 2} y={y + 0.8} textAnchor="middle" fontSize={0.22} className="fp-room-name">
            SHKALLËT
          </text>
          <text x={liftX + liftW / 2} y={y + 3.95} textAnchor="middle" fontSize={0.19} className="fp-room-name">
            ASHENSORI
          </text>
        </g>
      )}
    </g>
  );
}

export function NorthArrow({ x, y, size = 1.2 }: { x: number; y: number; size?: number }) {
  const r = size / 2;
  return (
    <g transform={`translate(${x} ${y})`} className="fp-north">
      <circle r={r} fill="none" />
      <path d={`M 0 ${-r * 0.8} L ${r * 0.32} ${r * 0.45} L 0 ${r * 0.2} L ${-r * 0.32} ${r * 0.45} Z`} />
      <text y={-r - 0.18} textAnchor="middle" fontSize={size * 0.3}>
        V
      </text>
    </g>
  );
}

export function ScaleBar({ x, y, metres = 5 }: { x: number; y: number; metres?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="fp-scale">
      {Array.from({ length: metres }, (_, i) => (
        <rect key={i} x={i} y={0} width={1} height={0.14} className={i % 2 ? "fp-scale-b" : "fp-scale-a"} />
      ))}
      <text x={0} y={0.5} fontSize={0.26}>0</text>
      <text x={metres} y={0.5} fontSize={0.26} textAnchor="end">
        {metres} m
      </text>
    </g>
  );
}

/** Overall dimension line with ticks and centred text. */
export function DimLine({
  x1,
  y1,
  x2,
  y2,
  label,
  offset = 0,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  offset?: number;
}) {
  const horizontal = Math.abs(y1 - y2) < 0.001;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const tick = 0.18;
  return (
    <g className="fp-dim">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      {[
        [x1, y1],
        [x2, y2],
      ].map(([px, py], i) => (
        <line key={i} x1={px - tick} y1={py + tick} x2={px + tick} y2={py - tick} />
      ))}
      {horizontal ? (
        <text x={mx} y={my - 0.14 + offset} textAnchor="middle" fontSize={0.26}>
          {label}
        </text>
      ) : (
        <text
          x={mx}
          y={my}
          textAnchor="middle"
          fontSize={0.26}
          transform={`rotate(-90 ${mx} ${my}) translate(0 ${-0.14 + offset})`}
        >
          {label}
        </text>
      )}
    </g>
  );
}
