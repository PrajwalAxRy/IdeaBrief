'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger offset for siblings — 02 §2.12: "90ms stagger between siblings." */
  delayMs?: number;
}

/**
 * Scroll-triggered fade + rise (02 §2.12): `opacity 0->1`, `translateY(20px)->0`,
 * `--dur-enter` (600ms), `IntersectionObserver` at `threshold: 0.08`,
 * unobserved after firing once — never re-triggers on scroll-back. Landing
 * sections only (`WhatYouGet`, `TrustSection`); the Report deliberately does
 * NOT get this treatment — P8 built it to ship almost no JS, and wrapping
 * every section in a client `Reveal` would undo that. Logged 'use client'
 * addition beyond the 13-name allowlist — this exact motion work is P11's
 * own scope.
 */
export function Reveal({ children, className = '', delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={['reveal', visible ? 'reveal--visible' : '', className].filter(Boolean).join(' ')}
      style={{ transitionDelay: visible ? `${delayMs}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
