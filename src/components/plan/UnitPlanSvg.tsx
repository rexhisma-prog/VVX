import type { Apartment } from "@/data/apartments";
import { bbox, placeLayout } from "@/lib/plan/geometry";
import { DimLine, NorthArrow, PlanDefs, UnitDrawing } from "./PlanParts";

/**
 * Detailed drawing of a single apartment, in its real orientation on the
 * floor (mirrored layouts are drawn mirrored).
 */
export default function UnitPlanSvg({
  apartment,
  id,
  className,
  dims = true,
  furniture = true,
  labels = "detailed",
  north = true,
}: {
  apartment: Apartment;
  id: string;
  className?: string;
  dims?: boolean;
  furniture?: boolean;
  labels?: "detailed" | "simple" | "none";
  north?: boolean;
}) {
  const { layout, slot } = apartment;
  const unit = placeLayout(layout, 0, 0, slot.mirrorX, slot.mirrorY);
  const [bx, by, bw, bh] = bbox(unit.rooms.flatMap((r) => r.parts));
  const balcony = unit.rooms.filter((r) => r.kind === "balcony").flatMap((r) => r.parts);
  const bal = balcony.length ? bbox(balcony) : null;

  const m = dims ? 1.5 : 0.5;
  const vb = [bx - m, by - m, bw + m + (north ? 1.6 : 0.5), bh + m + 0.5];
  const dimY = by - 0.75;
  const dimX = bx - 0.75;

  return (
    <svg
      viewBox={vb.join(" ")}
      className={`fp ${className ?? ""}`}
      role="img"
      aria-label={`Planimetria e apartamentit ${apartment.number}, ${layout.typology}`}
    >
      <PlanDefs id={id} />
      <UnitDrawing unit={unit} id={id} furniture={furniture} labels={labels} />
      {dims && (
        <>
          <DimLine x1={0} y1={dimY} x2={unit.w} y2={dimY} label={`${unit.w.toFixed(2)} m`} />
          <DimLine x1={dimX} y1={0} x2={dimX} y2={unit.h} label={`${unit.h.toFixed(2)} m`} />
          {bal && (
            <DimLine
              x1={dimX}
              y1={bal[1]}
              x2={dimX}
              y2={bal[1] + bal[3]}
              label={`${bal[3].toFixed(2)}`}
            />
          )}
        </>
      )}
      {north && <NorthArrow x={bx + bw + 0.9} y={by + 0.6} size={0.9} />}
    </svg>
  );
}
