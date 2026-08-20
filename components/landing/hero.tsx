import { HERO } from '@/lib/content/landing';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { HeroCollage } from './hero-collage';
import { ScrollReveal } from './scroll-reveal';
import { WordReveal } from './word-reveal';

/**
 * The hero: an oversized weight-400 headline sitting inside a perspective
 * media collage, on the deepest surface in the system. Everything else on the
 * page is hairlines and type; this is the one atmospheric moment.
 */
export function Hero() {
  return (
    <section className="ob-hero" aria-labelledby="hero-headline">
      <HeroCollage />

      <div className="ob-hero-content ob-container flex flex-col items-center gap-8 text-center">
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
          className="ob-display max-w-[16ch]"
          lines={HERO.headlineLines}
          trigger="mount"
          delay={220}
          stagger={62}
        />

        <ScrollReveal delay={620} className="max-w-[62ch]">
          <p className="ob-lead">{HERO.lead}</p>
        </ScrollReveal>

        <ScrollReveal delay={760}>
          <div className="flex items-center justify-center gap-4 pt-2">
            <a href={HERO.primary.href} className="ob-btn ob-btn-primary">
              {HERO.primary.label}
            </a>
            <Link href={HERO.secondary.href} className="ob-btn ob-btn-ghost">
              {HERO.secondary.label}
            </Link>
          </div>
        </ScrollReveal>

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
