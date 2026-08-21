'use client';

import { CopyButton } from '@/components/ui/copy-button';
import { BRIEF } from '@/lib/content/app';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/** The rule draws for this long, then the redirect fires. The button skips
 *  ahead immediately. */
export const APPROVE_HANDOFF_MS = 4000;

/**
 * What replaces the whole left column once the brief is approved.
 *
 * **The bookmark line gets read.** It used to flash for 500ms under the
 * composer, which made one of the IA's three non-optional access obligations
 * effectively invisible. It is now the column.
 *
 * The rule beneath is `--ob-accent` **because the run is live** — that is
 * blue's third job, and it is the only accent in this column. Because this
 * column now carries a primary button, the aside's `ApproveButton` is gone by
 * construction and rule 11 holds through the transition.
 *
 * **Under reduced motion there is no auto-redirect at all** and the rule is
 * static at full width: an auto-advance the user did not trigger is motion,
 * and the escape is the button that is already there.
 */
export function DefineHandoff({
  slug,
  reduced,
  onAdvance,
}: { slug: string; reduced: boolean; onAdvance: () => void }) {
  const [url, setUrl] = useState(`/r/${slug}`);

  useEffect(() => {
    setUrl(`${window.location.origin}/r/${slug}`);
  }, [slug]);

  useEffect(() => {
    if (reduced) return;
    const timer = setTimeout(onAdvance, APPROVE_HANDOFF_MS);
    return () => clearTimeout(timer);
  }, [reduced, onAdvance]);

  return (
    <div className="ob-define-handoff">
      <p className="ob-meta">{BRIEF.handoff.marker}</p>
      <h2 className="ob-h2">{BRIEF.handoff.title}</h2>
      <p className="ob-lead">{BRIEF.handoff.lead}</p>

      <div className="ob-define-handoff-url">
        <span className="ob-define-handoff-link">{url}</span>
        <CopyButton text={url} label="Copy link" variant="button" />
      </div>

      <Link href={`/r/${slug}/validate`} className="ob-btn ob-btn-primary">
        {BRIEF.handoff.action}
      </Link>

      <div
        className="ob-define-handoff-rule"
        data-drawn={!reduced || undefined}
        aria-hidden="true"
      />
    </div>
  );
}
