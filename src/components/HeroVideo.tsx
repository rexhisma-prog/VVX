"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Full-screen background video for the homepage hero.
 * - autoplay, muted, loop, playsInline, no controls
 * - falls back to the poster image if playback is unavailable or the
 *   visitor prefers reduced motion
 */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      return;
    }
    v.muted = true;
    const p = v.play();
    if (p && typeof p.catch === "function") p.catch(() => setFailed(true));
  }, [reduced]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-brand" aria-hidden>
      {/* fallback image (always underneath) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${poster})` }}
      />
      {!failed && !reduced && (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={poster}
          disablePictureInPicture
          onError={() => setFailed(true)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
