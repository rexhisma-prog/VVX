/**
 * Architectural furniture symbols.
 * Each symbol is drawn in a local box (lw × lh, metres) with its "back"
 * along the top edge; the caller rotates it into place.
 */
import type { Furniture } from "@/lib/plan/types";
import type { ReactNode } from "react";

const S = 0.018; // stroke width (m)

function rect(x: number, y: number, w: number, h: number, rx = 0, extra: Record<string, unknown> = {}) {
  const { key, ...rest } = extra;
  return <rect key={key as string | undefined} x={x} y={y} width={w} height={h} rx={rx} {...rest} />;
}

function line(x1: number, y1: number, x2: number, y2: number, extra: Record<string, unknown> = {}) {
  const { key, ...rest } = extra;
  return <line key={key as string | undefined} x1={x1} y1={y1} x2={x2} y2={y2} {...rest} />;
}

function bed(lw: number, lh: number, double: boolean): ReactNode {
  const pillows = double ? 2 : 1;
  const pw = (lw - 0.2 - (pillows - 1) * 0.08) / pillows;
  return (
    <>
      {rect(0, 0, lw, lh, 0.04)}
      {rect(0, 0, lw, 0.07, 0, { className: "fp-dark" })}
      {Array.from({ length: pillows }, (_, i) =>
        rect(0.1 + i * (pw + 0.08), 0.14, pw, 0.34, 0.07, { key: i }),
      )}
      {line(0, 0.62, lw, 0.62)}
      <path d={`M ${lw * 0.55} 0.62 L ${lw} ${0.62 + lw * 0.32} L ${lw} 0.62 Z`} className="fp-soft" />
    </>
  );
}

function sofa(lw: number, lh: number, seats?: number): ReactNode {
  const n = seats ?? Math.max(1, Math.round((lw - 0.4) / 0.7));
  const arm = 0.18;
  const back = 0.2;
  const cw = (lw - arm * 2) / n;
  return (
    <>
      {rect(0, 0, lw, lh, 0.06)}
      {rect(arm, 0, lw - arm * 2, back, 0.02)}
      {rect(0, 0, arm, lh, 0.06)}
      {rect(lw - arm, 0, arm, lh, 0.06)}
      {Array.from({ length: n - 1 }, (_, i) =>
        line(arm + cw * (i + 1), back, arm + cw * (i + 1), lh - 0.04, { key: i }),
      )}
    </>
  );
}

function dining(lw: number, lh: number): ReactNode {
  const n = Math.max(1, Math.floor((lw - 0.2) / 0.6));
  const cw = 0.42;
  const gap = (lw - n * cw) / (n + 1);
  const chairs: ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const x = gap + i * (cw + gap);
    chairs.push(rect(x, 0, cw, 0.38, 0.06, { key: `t${i}` }));
    chairs.push(rect(x, lh - 0.38, cw, 0.38, 0.06, { key: `b${i}` }));
  }
  return (
    <>
      {chairs}
      {rect(0.05, 0.3, lw - 0.1, lh - 0.6, 0.04, { className: "fp-table" })}
    </>
  );
}

function kitchen(lw: number, lh: number): ReactNode {
  const sinkX = Math.min(lw * 0.22, lw - 1.3);
  const hobX = lw - 0.8;
  const showHob = lw >= 1.6;
  return (
    <>
      {rect(0, 0, lw, lh)}
      {line(0, lh - 0.04, lw, lh - 0.04)}
      {rect(Math.max(0.1, sinkX), 0.1, 0.55, 0.38, 0.06)}
      <circle cx={Math.max(0.1, sinkX) + 0.275} cy={0.29} r={0.035} />
      {showHob && (
        <>
          {rect(hobX, 0.06, 0.6, 0.48, 0.02)}
          {[
            [0.16, 0.18],
            [0.44, 0.18],
            [0.16, 0.42],
            [0.44, 0.42],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={hobX + cx} cy={cy} r={0.085} />
          ))}
        </>
      )}
    </>
  );
}

function wc(lw: number, lh: number): ReactNode {
  return (
    <>
      {rect(lw * 0.06, 0, lw * 0.88, 0.18, 0.03)}
      <ellipse cx={lw / 2} cy={0.18 + (lh - 0.18) / 2} rx={lw * 0.42} ry={(lh - 0.2) / 2} />
      <ellipse cx={lw / 2} cy={0.2 + (lh - 0.2) / 2} rx={lw * 0.28} ry={(lh - 0.2) / 2 - 0.08} />
    </>
  );
}

function basin(lw: number, lh: number): ReactNode {
  return (
    <>
      {rect(0, 0, lw, lh, 0.03)}
      <ellipse cx={lw / 2} cy={lh * 0.55} rx={lw * 0.36} ry={lh * 0.32} />
      <circle cx={lw / 2} cy={0.07} r={0.025} className="fp-dark" />
    </>
  );
}

export function renderSymbol(t: Furniture["t"], lw: number, lh: number): ReactNode {
  switch (t) {
    case "bed-double":
      return bed(lw, lh, true);
    case "bed-single":
      return bed(lw, lh, false);
    case "nightstand":
      return (
        <>
          {rect(0, 0, lw, lh, 0.02)}
          <circle cx={lw / 2} cy={lh / 2} r={Math.min(lw, lh) * 0.24} />
        </>
      );
    case "wardrobe":
      return (
        <>
          {rect(0, 0, lw, lh)}
          {line(0.04, lh / 2, lw - 0.04, lh / 2, { strokeDasharray: "0.06 0.04" })}
          {Array.from({ length: Math.max(1, Math.floor(lw / 0.24)) }, (_, i) =>
            line(0.14 + i * 0.24, lh / 2 - 0.17, 0.2 + i * 0.24, lh / 2 + 0.17, { key: i }),
          )}
        </>
      );
    case "sofa":
      return sofa(lw, lh);
    case "sofa-l":
      return sofa(lw, lh);
    case "armchair":
      return sofa(lw, lh, 1);
    case "coffee-table":
      return rect(0, 0, lw, lh, 0.06, { className: "fp-table" });
    case "tv":
      return (
        <>
          {rect(0, 0, lw, lh * 0.75, 0.02)}
          {rect(lw * 0.12, 0.03, lw * 0.76, 0.05, 0, { className: "fp-dark" })}
        </>
      );
    case "dining":
      return dining(lw, lh);
    case "kitchen":
      return kitchen(lw, lh);
    case "counter":
      return (
        <>
          {rect(0, 0, lw, lh)}
          {line(0, lh - 0.04, lw, lh - 0.04)}
        </>
      );
    case "fridge":
      return (
        <>
          {rect(0, 0, lw, lh)}
          {line(0, 0, lw, lh, { className: "fp-faint" })}
          {line(lw, 0, 0, lh, { className: "fp-faint" })}
        </>
      );
    case "wc":
      return wc(lw, lh);
    case "basin":
      return basin(lw, lh);
    case "shower":
      return (
        <>
          {rect(0, 0, lw, lh)}
          {line(0, 0, lw, lh, { className: "fp-faint" })}
          {line(lw, 0, 0, lh, { className: "fp-faint" })}
          <circle cx={lw / 2} cy={lh / 2} r={0.05} />
        </>
      );
    case "bathtub":
      return (
        <>
          {rect(0, 0, lw, lh, 0.06)}
          {rect(0.07, 0.07, lw - 0.14, lh - 0.14, Math.min(lw, lh) * 0.3)}
          <circle cx={lw - 0.22} cy={lh / 2} r={0.035} />
        </>
      );
    case "washer":
      return (
        <>
          {rect(0, 0, lw, lh, 0.03)}
          <circle cx={lw / 2} cy={lh / 2 + 0.03} r={Math.min(lw, lh) * 0.3} />
          <circle cx={lw / 2} cy={lh / 2 + 0.03} r={Math.min(lw, lh) * 0.18} />
        </>
      );
    case "desk":
      return (
        <>
          {rect(0, 0, lw, lh * 0.62, 0.02, { className: "fp-table" })}
          {rect(lw / 2 - 0.22, lh * 0.62 + 0.04, 0.44, 0.34, 0.08)}
        </>
      );
    case "plant":
      return (
        <>
          <circle cx={lw / 2} cy={lh / 2} r={Math.min(lw, lh) * 0.48} />
          <path
            d={`M ${lw / 2} ${lh * 0.08} L ${lw / 2} ${lh * 0.92} M ${lw * 0.08} ${lh / 2} L ${lw * 0.92} ${lh / 2} M ${lw * 0.2} ${lh * 0.2} L ${lw * 0.8} ${lh * 0.8} M ${lw * 0.8} ${lh * 0.2} L ${lw * 0.2} ${lh * 0.8}`}
            className="fp-faint"
          />
        </>
      );
    case "rug":
      return rect(0, 0, lw, lh, 0, { className: "fp-rug" });
    case "shelf":
      return (
        <>
          {rect(0, 0, lw, lh)}
          {line(0, lh / 2, lw, lh / 2, { className: "fp-faint" })}
        </>
      );
    case "lounger":
      return (
        <>
          {rect(0, 0, lw, lh, 0.08)}
          {line(lw * 0.3, 0, lw * 0.3, lh)}
        </>
      );
    case "outdoor-table":
      return (
        <>
          {rect(0.02, lh * 0.32, 0.22, 0.36, 0.05)}
          {rect(lw - 0.24, lh * 0.32, 0.22, 0.36, 0.05)}
          <circle cx={lw / 2} cy={lh / 2} r={Math.min(lw, lh) * 0.26} className="fp-table" />
        </>
      );
    default:
      return rect(0, 0, lw, lh);
  }
}

export function FurnitureItem({ item }: { item: Furniture }) {
  const rot = item.rot ?? 0;
  const vertical = rot === 90 || rot === 270;
  const lw = vertical ? item.h : item.w;
  const lh = vertical ? item.w : item.h;
  const cx = item.x + item.w / 2;
  const cy = item.y + item.h / 2;
  return (
    <g
      transform={`translate(${cx} ${cy}) rotate(${rot}) translate(${-lw / 2} ${-lh / 2})`}
      strokeWidth={S}
    >
      {renderSymbol(item.t, lw, lh)}
    </g>
  );
}
