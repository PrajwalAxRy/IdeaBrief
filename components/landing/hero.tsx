import { MediaSlot } from '@/components/ui/media-slot';
import { HERO } from '@/lib/content/landing';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HeroCollage } from './hero-collage';
import { ScrollReveal } from './scroll-reveal';
import { WordReveal } from './word-reveal';

/**
 * The hero: a left-aligned weight-400 headline against a product loop on the
 * right, both sitting inside a perspective media collage on the deepest surface
 * in the system. Everything else on the page is hairlines and type; this is the
 * one atmospheric moment.
 *
 * The right column is a `MediaSlot` until the loop exists — briefed in
 * higgsfieldPlan.md §7. Per standing rule 14 it renders in production: a slot
 * is the spec for an asset someone still owes, not scaffolding to delete.
 */
export function Hero() {
  return (
    <section className="ob-hero" aria-labelledby="hero-headline">
      <HeroCollage />

      <div className="ob-hero-content ob-container">
        <div className="ob-hero-grid">
          <div className="ob-hero-copy flex flex-col items-start gap-8">
            <ScrollReveal delay={80}>
              <a href="#verification" className="ob-badge">
                <span className="ob-badge-tag">{HERO.badge.tag}</span>
                <span>{HERO.badge.text}</span>
                <ArrowUpRight size={15} className="ob-arrow mr-3 shrink-0" aria-hidden="true" />
              </a>
            </ScrollReveal>

            <WordReveal
              as="h1"
              id="hero-headline"
              className="ob-display ob-hero-headline"
              lines={HERO.headlineLines}
              trigger="mount"
              delay={220}
              stagger={62}
            />

            <ScrollReveal delay={620} className="max-w-[48ch]">
              <p className="ob-lead">{HERO.lead}</p>
            </ScrollReveal>

            <ScrollReveal delay={760}>
              <div className="flex items-center gap-4 pt-2">
                <a href={HERO.primary.href} className="ob-btn ob-btn-primary">
                  {HERO.primary.label}
                </a>
                <Link href={HERO.secondary.href} className="ob-btn ob-btn-ghost">
                  {HERO.secondary.label}
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={900} className="ob-hero-media">
            <MediaSlot
              ratio="16/9"
              kind="video"
              label="HERO / PRODUCT LOOP"
              brief="Silent 12s loop of the product doing the one thing the headline claims: a
                single typed sentence resolving into an evidence-backed brief. Screen-recorded
                UI only, near-monochrome, one electric-blue accent on the live/verified marks.
                Continuous drift, no cuts, first and last frame identical."
              source="1600×900 WebM + MP4 fallback, poster still, /public/media/hero/product-loop.*"
            />
          </ScrollReveal>
        </div>

        <ScrollReveal delay={1000}>
          <div className="ob-scroll-cue pt-20">
            <span className="ob-meta">{HERO.cue}</span>
            <span className="ob-scroll-cue-track" aria-hidden="true" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
