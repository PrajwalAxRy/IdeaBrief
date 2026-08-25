import { PageContainer } from '@/components/layout/page-container';
import { Wordmark } from '@/components/layout/wordmark';
import { SkipLink } from '@/components/ui/skip-link';

/**
 * The standalone shell — wordmark, one hairline, a vertically-open body. Used
 * by `/sign-in` (A21) and nothing else yet.
 *
 * **Why this is not the `(site)` shell.** A sign-in page must not render a nav
 * carrying a Sign in link, and it must not render a footer whose whole job is
 * to say what the product does not charge you for. The assembly below is
 * `app/not-found.tsx`'s, which is the existing surface for "a page that is not
 * part of the product's furniture" — `.ob-standalone` and its five parts are
 * already built and already measured.
 *
 * **The backdrop is not here.** C13 puts it on the page, and this group has one
 * page. Mounting it at the layout would break C13's letter to save one line.
 *
 * Server Component. The form inside it is the client leaf.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ob-standalone">
      <SkipLink />

      <header className="ob-standalone-head">
        <PageContainer variant="marketing">
          <Wordmark />
          <hr className="ob-rule" />
        </PageContainer>
      </header>

      <main id="main" className="ob-standalone-body">
        {children}
      </main>
    </div>
  );
}
