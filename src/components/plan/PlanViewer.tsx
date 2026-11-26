"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const ZOOMS = [1, 1.5, 2, 2.6, 3.2];

/** Zoomable / pannable frame for a plan drawing (buttons, scroll and mouse drag). */
export default function PlanViewer({ children, label }: { children: ReactNode; label: string }) {
  const [z, setZ] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; sl: number; st: number } | null>(null);

  useEffect(() => {
    if (window.innerWidth < 768) setZ(2);
  }, []);

  return (
    <div className="border border-line bg-white">
      <div className="no-print flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-sm font-semibold">{label}</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setZ((v) => Math.max(0, v - 1))}
            disabled={z === 0}
            className="flex h-9 w-9 items-center justify-center border border-line text-lg disabled:opacity-30"
            aria-label="Zvogëlo"
          >
            −
          </button>
          <span className="w-12 text-center text-xs tabular-nums text-muted">{Math.round(ZOOMS[z] * 100)}%</span>
          <button
            type="button"
            onClick={() => setZ((v) => Math.min(ZOOMS.length - 1, v + 1))}
            disabled={z === ZOOMS.length - 1}
            className="flex h-9 w-9 items-center justify-center border border-line text-lg disabled:opacity-30"
            aria-label="Zmadho"
          >
            +
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className={`max-h-[80vh] overflow-auto overscroll-contain ${z > 0 ? "md:cursor-grab md:active:cursor-grabbing" : ""}`}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse" || z === 0) return;
          const el = ref.current!;
          drag.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          ref.current!.scrollLeft = d.sl - (e.clientX - d.x);
          ref.current!.scrollTop = d.st - (e.clientY - d.y);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <div style={{ width: `${ZOOMS[z] * 100}%` }} className="p-3 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
