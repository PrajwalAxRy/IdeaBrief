'use client';

import { Well } from '@/components/ui/well';
import { useCopy } from '@/lib/hooks/use-copy';
import { Copy } from 'lucide-react';

interface ScriptBlockProps {
  lines: string[];
  /** The exact plain text written to the clipboard — no markdown, no labels, no attribution footer. */
  copyText: string;
  copyLabel?: string;
  /** `.btn-primary` when this card is the expanded one, `.btn-secondary` otherwise (08). */
  primary?: boolean;
}

/**
 * The copy-pasteable interview script — `Copy script` is the primary action
 * of the Open Question Card, the whole point of Pillar 3a. Reuses the
 * `useCopy` hook `CopyButton` is built on (extracted in P6 for exactly this)
 * rather than `CopyButton` itself, since `CopyButton` only ever renders the
 * secondary skin and this needs to switch to `.btn-primary` on the expanded
 * card. Logged 'use client' addition beyond the 13-name allowlist.
 */
export function ScriptBlock({
  lines,
  copyText,
  copyLabel = 'Copy script',
  primary = false,
}: ScriptBlockProps) {
  const { state, copy } = useCopy();

  return (
    <div className="flex flex-col items-start gap-3">
      <Well padding="none" className="p-5 w-full">
        <div className="script-block-lines">
          {lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </Well>
      <button
        type="button"
        className={`btn ${primary ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        onClick={() => copy(copyText)}
      >
        {state === 'idle' && (
          <>
            <Copy size={14} />
            {copyLabel}
          </>
        )}
        {state === 'copied' && '✓ Copied'}
        {state === 'failed' && 'Press ⌘C'}
      </button>
    </div>
  );
}
