import { APP_CHROME } from '@/lib/content/app';
import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The thin run-page footer: run id, copy link, "Start another idea."
 *
 * Suppressed on Define by §5's `main[data-chrome='surface'] ~ .ob-run-footer`,
 * which is why this must stay the sibling immediately after `<main>`.
 *
 * `copyLink` arrives as a prop for the same reason it does on `RunHeader`:
 * `CopyLinkButton` reads `headers()` and is rendered once, in the layout.
 */
export function RunFooterBar({ slug, copyLink }: { slug: string; copyLink: ReactNode }) {
  return (
    <footer className="ob-run-footer">
      <div className="ob-container-app flex h-full items-center justify-between">
        <span className="ob-meta">RUN {slug}</span>
        <div className="flex items-center gap-6">
          {copyLink}
          <Link href="/" className="ob-btn ob-btn-bare">
            {APP_CHROME.footerAction} <span className="ob-arrow">→</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
