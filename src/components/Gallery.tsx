"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SiteImage } from "@/data/images";

type Variant = "mosaic" | "row" | "grid";

export default function Gallery({
  images,
  variant = "grid",
  label = "Galeria",
}: {
  images: SiteImage[];
  variant?: Variant;
  label?: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const open = (i: number, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setIndex(i);
  };

  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus();
  }, []);

  const layoutClass = (i: number) => {
    if (variant === "mosaic") {
      const pattern = ["md:col-span-7 aspect-[4/3]", "md:col-span-5 aspect-[4/3] md:aspect-auto", "md:col-span-4 aspect-[4/3]", "md:col-span-4 aspect-[4/3]", "md:col-span-4 aspect-[4/3]", "md:col-span-6 aspect-[4/3]", "md:col-span-6 aspect-[4/3]"];
      return pattern[i % pattern.length];
    }
    if (variant === "row") return "aspect-[4/3]";
    return "aspect-[4/3]";
  };

  const gridClass =
    variant === "mosaic"
      ? "grid gap-4 md:grid-cols-12 md:gap-5"
      : variant === "row"
        ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        : "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5";

  return (
    <>
      <ul className={gridClass} aria-label={label}>
        {images.map((im, i) => (
          <li key={`${im.src}-${i}`} className={`${layoutClass(i)} relative`} data-reveal>
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="zoom-img group absolute inset-0 block overflow-hidden bg-stone-2 text-left"
              aria-label={`Zmadho fotografinë: ${im.alt}`}
            >
              <Image
                src={im.src}
                alt={im.alt}
                fill
                sizes={variant === "row" ? "(min-width: 1024px) 25vw, 50vw" : "(min-width: 768px) 40vw, 100vw"}
                className="object-cover"
              />
              <span className="absolute inset-0 bg-brand/0 transition-colors duration-500 group-hover:bg-brand/20" />
              <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center bg-white/90 text-brand opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                  <path d="M10 2h4v4M6 14H2v-4M14 2 9 7M2 14l5-5" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {index !== null && <Lightbox images={images} index={index} setIndex={setIndex} onClose={close} />}
    </>
  );
}

export function Lightbox({
  images,
  index,
  setIndex,
  onClose,
}: {
  images: SiteImage[];
  index: number;
  setIndex: (i: number) => void;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);
  const n = images.length;
  const prev = useCallback(() => setIndex((index - 1 + n) % n), [index, n, setIndex]);
  const next = useCallback(() => setIndex((index + 1) % n), [index, n, setIndex]);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, prev, next]);

  const im = images[index];
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shikuesi i fotografive"
      className="fixed inset-0 z-[70] flex flex-col bg-[#071311]/95 text-white"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
        touch.current = null;
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-sm text-white/70">
        <span className="tabular-nums">
          {index + 1} / {n}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center text-2xl hover:text-white"
          aria-label="Mbyll"
        >
          ×
        </button>
      </div>
      <div className="relative flex-1" onClick={onClose}>
        <div className="absolute inset-4 md:inset-x-24 md:inset-y-6" onClick={(e) => e.stopPropagation()}>
          <Image key={im.src} src={im.src} alt={im.alt} fill sizes="100vw" className="anim-fade object-contain" />
        </div>
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 hover:bg-white/20 md:left-6"
              aria-label="Fotografia e mëparshme"
            >
              <svg viewBox="0 0 20 12" className="h-3 w-5 rotate-180" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                <path d="M0 6h18M13 1l5 5-5 5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-2 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center bg-white/10 hover:bg-white/20 md:right-6"
              aria-label="Fotografia tjetër"
            >
              <svg viewBox="0 0 20 12" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
                <path d="M0 6h18M13 1l5 5-5 5" />
              </svg>
            </button>
          </>
        )}
      </div>
      <p className="px-5 py-5 text-center text-sm text-white/75">{im.alt}</p>
    </div>
  );
}
