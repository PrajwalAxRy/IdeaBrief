'use client';

import { ROADMAP } from '@/lib/content/app';
import { useCopy } from '@/lib/hooks/use-copy';
import { Copy } from 'lucide-react';
import type { ReactNode } from 'react';

interface ScriptBlockProps {
  /** Rendered lines. Numbering is CSS; the data carries none. */
  lines: ReactNode[];
  /** The exact plain text written to the clipboard. */
  copyText: string;
  copyLabel?: string;
  /** `.ob-btn-primary` only on the first expanded card (rule 11). */
  primary?: boolean;
}

/**
 * The copy-pasteable interview script — the Open Question Card's primary
 * action.
 *
 * **Numbering moved into CSS and out of the data.** The fixture used to store
 * `"1. Walk me through…"`, which is presentation living in a field: it makes
 * the number un-restylable, breaks if a line is inserted, and has to be
 * stripped before any other use. `counter-increment` draws it now, and
 * `buildScriptText` rebuilds it for the clipboard.
 *
 * **Lines are keyed by index, not by content** — two identical lines collided
 * before.
 *
 * **Copy confirmation is the label swap and nothing else. There are no toasts
 * in this product.**
 */
export function ScriptBlock({
  lines,
  copyText,
  copyLabel = ROADMAP.copyScript,
  primary = false,
}: ScriptBlockProps) {
  const { state, copy } = useCopy();

  return (
    <div className="flex flex-col items-start gap-3">
      <ol className="ob-script">
        {lines.map((line, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: two identical lines must not collide
          <li key={index} className="ob-script-line">
            {line}
          </li>
        ))}
      </ol>
      <button
        type="button"
        className={`ob-btn ${primary ? 'ob-btn-primary' : 'ob-btn-ghost'}`}
        onClick={() => copy(copyText)}
      >
        {state === 'idle' && (
          <>
            <Copy size={14} aria-hidden="true" />
            {copyLabel}
          </>
        )}
        {state === 'copied' && ROADMAP.copied}
        {state === 'failed' && ROADMAP.copyFailed}
      </button>
    </div>
  );
}
