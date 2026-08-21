'use client';

import { COLLAGE } from '@/lib/content/landing';
import { useEffect, useRef, useState } from 'react';

/**
 * The perspective media collage behind the hero headline.
 *
 * Each card translates against the scroll at its own rate — small outer cards
 * move fastest (foreground), the large centre card barely moves (background) —
 * which reads as depth without any 3D. The transform is written straight to the
 * node inside a single rAF-throttled listener; React never re-renders on scroll.
 *
 * Entrance is opacity-only on purpose: `transform` is owned entirely by the
 * parallax writer, so nothing else is allowed to touch it.
 *
 * Placeholder photography, hotlinked from Unsplash. Every card is briefed for
 * replacement in higgsfieldPlan.md §1 — these are stand-ins, not the design.
 */
export function HeroCollage() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    let frame = 0;

    const read = () => {
      frame = 0;
      const y = window.scrollY;
      /* Past one viewport the hero is gone; clamping stops the cards drifting
         into absurd offsets on a long page. */
      const progress = Math.min(y / Math.max(window.innerHeight, 1), 1.2);

      for (let i = 0; i < COLLAGE.length; i += 1) {
        const node = cardRefs.current[i];
        const card = COLLAGE[i];
        if (!node || !card) continue;
        const shift = -y * card.depth;
        const scale = 1 + progress * 0.06;
        node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0) rotate(${card.rotate}deg) scale(${scale.toFixed(3)})`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="ob-collage" aria-hidden="true">
      {COLLAGE.map((card, i) => (
        <div
          key={card.id}
          ref={(node) => {
            cardRefs.current[i] = node;
          }}
          className="ob-collage-card"
          style={{
            left: card.left,
            top: card.top,
            width: card.width,
            height: card.height,
            transform: `rotate(${card.rotate}deg)`,
            opacity: mounted ? card.opacity : 0,
            /* **A15 retune: 1400ms → `--ob-enter` (900ms).** 1400ms sat in the
               dead zone between the structural band (150–900ms) and the ambient
               band (20–50s). This is an entrance, so it belongs at the top of
               the structural band — the same call the plan makes for count-ups,
               and for the same reason: the system has exactly three durations
               and will not grow a fourth. The easing is now the token rather
               than a repeated literal. The stagger is a *delay*, not a
               duration, and is unchanged. */
            transition: `opacity var(--ob-enter) var(--ob-ease) ${180 + i * 110}ms`,
          }}
        >
          {/* Plain <img>, not next/image: these are temporary hotlinked
              placeholders headed for local generated assets, and routing them
              through the optimiser would make the build depend on a remote
              fetch for art that is about to be replaced. */}
          <img src={card.src} alt="" loading={i === 2 ? 'eager' : 'lazy'} decoding="async" />
        </div>
      ))}
      <div className="ob-collage-veil" />
    </div>
  );
}
