import { CofounderChat } from '@/components/landing/cofounder-chat';
import { DimensionMarquee } from '@/components/landing/dimension-marquee';
import { Hero } from '@/components/landing/hero';
import { Pillars } from '@/components/landing/pillars';
import { SiteFooter } from '@/components/landing/site-footer';
import { SiteNav } from '@/components/landing/site-nav';
import { Verification } from '@/components/landing/verification';
import { SkipLink } from '@/components/ui/skip-link';

/**
 * The landing page.
 *
 * Reading order is claim → capability → proof → input:
 *   Hero            what this is, in one sentence you could repeat
 *   Marquee         the scope of a research run, stated once
 *   Pillars   01    the three things you actually do here
 *   Verification    02  the mechanic that makes the second one trustworthy
 *   Cofounder chat  03  the demo and the live entry point, same surface
 *
 * Obsidian is not a theme, it is the system: A15 deleted Deep Canopy and with
 * it the `data-theme` attribute, so every recipe in styles/obsidian.css is
 * global and this page declares nothing.
 */
export default function Home() {
  return (
    <div>
      {/* One definition — the hand-rolled anchor that lived here is now
          `SkipLink`, which `RunShell` also mounts (R19). */}
      <SkipLink />

      <div className="ob-backdrop" data-image="true" aria-hidden="true">
        <div className="ob-backdrop-plate">
          <img className="ob-backdrop-media" src="/media/backdrop-field.webp" alt="" />
        </div>
      </div>

      <div className="ob-layer">
        <SiteNav />

        <main id="main">
          <Hero />

          <hr className="ob-rule" />
          <DimensionMarquee />
          <hr className="ob-rule" />

          <Pillars />

          <hr className="ob-rule" />

          <Verification />

          <hr className="ob-rule" />

          <CofounderChat />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
