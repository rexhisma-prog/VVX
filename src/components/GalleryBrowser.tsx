"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { galleryCategories, galleryImages } from "@/data/gallery";
import { Lightbox } from "./Gallery";

export default function GalleryBrowser() {
  const [cat, setCat] = useState<(typeof galleryCategories)[number]["id"]>("all");
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const items = useMemo(
    () => (cat === "all" ? galleryImages : galleryImages.filter((i) => i.category === cat)),
    [cat],
  );

  return (
    <>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Filtro sipas kategorisë">
        {galleryCategories.map((c) => {
          const count = c.id === "all" ? galleryImages.length : galleryImages.filter((i) => i.category === c.id).length;
          const active = c.id === cat;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={active}
              onClick={() => setCat(c.id)}
              className={`shrink-0 border px-4 py-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                active ? "border-brand bg-brand text-white" : "border-line text-ink hover:border-brand"
              }`}
            >
              {c.label} <span className={active ? "text-white/60" : "text-muted"}>{count}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3" aria-live="polite">
        {items.map((im, i) => (
          <li key={im.src} className="mb-5 break-inside-avoid">
            <button
              type="button"
              onClick={(e) => {
                trigger.current = e.currentTarget;
                setIndex(i);
              }}
              className="zoom-img group relative block w-full overflow-hidden bg-stone-2"
              aria-label={`Zmadho fotografinë: ${im.alt}`}
            >
              <Image
                src={im.src}
                alt={im.alt}
                width={im.width}
                height={im.height}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="h-auto w-full"
              />
              <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 text-left text-sm text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                {im.alt}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {index !== null && (
        <Lightbox
          images={items}
          index={index}
          setIndex={setIndex}
          onClose={() => {
            setIndex(null);
            trigger.current?.focus();
          }}
        />
      )}
    </>
  );
}
