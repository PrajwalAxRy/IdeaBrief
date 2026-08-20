import { CofounderChat } from '@/components/landing/cofounder-chat';
import { DimensionMarquee } from '@/components/landing/dimension-marquee';
import { Hero } from '@/components/landing/hero';
import { Pillars } from '@/components/landing/pillars';
import { SiteFooter } from '@/components/landing/site-footer';
import { SiteNav } from '@/components/landing/site-nav';
import { Verification } from '@/components/landing/verification';

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
 * `data-theme="obsidian"` scopes the entire visual system — every token and
 * recipe it uses is namespaced under that attribute, so this route restyles
 * itself and nothing else. The /r/[slug]/* run pages are untouched.
 */
export default function Home() {
  return (
    <div data-theme="obsidian">
      <a href="#main" className="ob-skip">
        Skip to content
      </a>

      <div className="ob-backdrop" aria-hidden="true" />

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
