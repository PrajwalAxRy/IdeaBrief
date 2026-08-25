import { SiteFooter } from '@/components/landing/site-footer';
import { SiteNav } from '@/components/landing/site-nav';
import { SkipLink } from '@/components/ui/skip-link';

/**
 * The marketing shell — nav, backdrop, footer — shared by `/`, `/pricing`,
 * `/runs` and `/account`.
 *
 * **Why this file exists.** `app/layout.tsx` renders a bare `<html><body>`: no
 * nav, no footer, no shell of any kind. Until A20 the landing hand-rolled all
 * of this inline, and `app/experiment/page.tsx` hand-rolled it a second time —
 * which is the existing proof that an unowned shell gets copied rather than
 * shared. Four more pages were about to make it six copies.
 *
 * **It is a nested layout, not a second root layout.** The Next 16 docs warn
 * that navigating between routes with *different root layouts* forces a full
 * page reload; a route-group layout under the one real root has no such cost.
 * `(site)` is URL-invisible, so nothing here changes a single path.
 *
 * `/sign-in` deliberately does **not** live in this group. It must not render a
 * nav carrying a Sign in link, and it must not render a footer that talks about
 * billing — it gets `(auth)`'s standalone shell instead.
 *
 * **The backdrop stays here rather than moving to `AppBackdrop`.** C13 puts the
 * app's backdrop on the *page* because the run layout cannot see the active
 * segment. This group has one atmosphere for every page in it, so there is
 * nothing to derive and nothing to drift.
 *
 * Server Component, and every page under it stays one too. The only client leaf
 * in this shell is `SiteNav`, which was already one.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* One definition — `RunShell` mounts the other (R19). */}
      <SkipLink />

      <div className="ob-backdrop" data-image="true" aria-hidden="true">
        <div className="ob-backdrop-plate">
          <img className="ob-backdrop-media" src="/media/backdrop-field.webp" alt="" />
        </div>
      </div>

      <div className="ob-layer">
        <SiteNav />

        <main id="main">{children}</main>

        <SiteFooter />
      </div>
    </div>
  );
}
