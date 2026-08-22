'use client';

import { useReducedMotion } from '@/lib/hooks/use-reduced-motion';

export interface FieldworkAsset {
  poster: string;
  mp4?: string;
  webm?: string;
}

/**
 * The one-component swap point for the fieldwork band's media.
 *
 * `FieldworkBand` renders a `MediaSlot` when a panel has no `src` and this when
 * it does, so **the slot and the asset are the same branch and the band's
 * height never changes** — the frame's `aspect-ratio` owns the height either
 * way.
 *
 * Reduced motion gets the poster, not a paused video: a `<video>` that has
 * stopped is still a video element claiming there is motion to see. The
 * `matchMedia` read is in an effect, never during render.
 *
 * WebM before MP4, `preload="metadata"`, no audio track at all.
 */
export function FieldworkMedia({ asset, alt }: { asset: FieldworkAsset; alt: string }) {
  const reduced = useReducedMotion();
  const hasVideo = Boolean(asset.mp4 && asset.webm);

  if (reduced || !hasVideo) {
    return <img className="ob-fieldwork-media" src={asset.poster} alt={alt} />;
  }

  return (
    <video
      className="ob-fieldwork-media"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={asset.poster}
      aria-label={alt}
    >
      <source src={asset.webm} type="video/webm" />
      <source src={asset.mp4} type="video/mp4" />
    </video>
  );
}
