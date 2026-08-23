'use client';

import {
  EVIDENCE_DEMO,
  type EvidenceDemo,
  VERIFICATION_COUNTERS,
  VERIFICATION_SECTION,
} from '@/lib/content/landing';
import { useInView } from '@/lib/hooks/use-in-view';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ScrollReveal } from './scroll-reveal';
import { SectionHead } from './section-head';

const RESOLVE_AFTER = 1200;
const HOLD_AFTER_RESOLVE = 2900;

/**
 * The verification section — the one mechanic that separates this from asking
 * a model to research something.
 *
 * An excerpt lands, the rule draws itself underneath it, and the verdict
 * resolves. Two pass; one fails and greys out, because the failure is the
 * argument. It cycles only while on screen.
 */
export function Verification() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35, once: false });
  const [reduced, setReduced] = useState(false);
  const [index, setIndex] = useState(0);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!inView || reduced) return;
    const delay = resolved ? HOLD_AFTER_RESOLVE : RESOLVE_AFTER;
    const timer = window.setTimeout(() => {
      if (resolved) {
        setIndex((current) => (current + 1) % EVIDENCE_DEMO.length);
        setResolved(false);
      } else {
        setResolved(true);
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [inView, resolved, reduced]);

  const current = EVIDENCE_DEMO[index];

  return (
    <section id="verification" className="ob-section" aria-labelledby="verification-headline">
      <div className="ob-container">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-24 items-end">
          <SectionHead
            index="02"
            id="verification-headline"
            eyebrow={VERIFICATION_SECTION.eyebrow}
            headlineLines={['The one thing a', 'chat prompt', 'can’t do.']}
          />
          <ScrollReveal delay={160} className="flex flex-col gap-7">
            <p className="ob-body">{VERIFICATION_SECTION.body}</p>
            <p className="ob-body ob-proof">{VERIFICATION_SECTION.kicker}</p>
          </ScrollReveal>
        </div>

        <hr className="ob-rule mt-28" />

        {/* The demo. Under reduced motion the cycle is replaced by all three
            shown at once — auto-advancing content is motion too. */}
        <div ref={ref} className="py-20">
          {reduced ? (
            <div className="mx-auto flex max-w-[820px] flex-col gap-5">
              {EVIDENCE_DEMO.map((item) => (
                <EvidenceCard key={item.id} item={item} resolved />
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-[820px] flex-col gap-8">
              <EvidenceCard key={current?.id} item={current} resolved={resolved} />

              <div className="flex items-center justify-center gap-2">
                {EVIDENCE_DEMO.map((item, i) => (
                  <button
                    type="button"
                    key={item.id}
                    className="ob-cycle-dot"
                    data-active={i === index}
                    aria-label={`Show excerpt ${item.id}`}
                    onClick={() => {
                      setIndex(i);
                      setResolved(false);
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <hr className="ob-rule" />

        <div className="grid grid-cols-4 gap-8 pt-16">
          {VERIFICATION_COUNTERS.map((counter, i) => (
            <ScrollReveal key={counter.label} delay={i * 90}>
              <Counter value={counter.value} accent={counter.accent} label={counter.label} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function EvidenceCard({ item, resolved }: { item?: EvidenceDemo; resolved: boolean }) {
  if (!item) return null;
  const state = resolved ? item.outcome : 'pending';
  const failed = item.outcome === 'discarded';

  return (
    <article className="ob-evidence" data-state={state}>
      <div className="flex items-center justify-between gap-6">
        <span className="ob-meta ob-meta-bright">
          {item.id} · {item.dimension}
        </span>
        <span className="ob-meta">{item.domain}</span>
      </div>

      <p className="ob-excerpt mt-6">“{item.excerpt}”</p>

      <div className="ob-verify-rule mt-6" />

      <div className="mt-4 flex h-5 items-center">
        <span className={`ob-verdict ob-meta ${failed ? 'ob-verdict-fail' : 'ob-verdict-pass'}`}>
          {failed ? <X size={13} aria-hidden="true" /> : <Check size={13} aria-hidden="true" />}
          {item.note}
        </span>
      </div>
    </article>
  );
}

function Counter({ value, accent, label }: { value: number; accent: boolean; label: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.6 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value);
      return;
    }

    let frame = 0;
    let start = 0;
    const step = (time: number) => {
      if (!start) start = time;
      const progress = Math.min((time - start) / 1100, 1);
      const eased = 1 - (1 - progress) ** 3;
      setShown(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className="flex flex-col gap-3">
      <span className={accent ? 'ob-counter ob-counter-accent' : 'ob-counter'}>{shown}</span>
      <span className="ob-meta ob-meta-solid">{label}</span>
    </div>
  );
}
