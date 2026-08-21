import { MetaLine } from '@/components/ui/meta-line';
import { Wordmark } from './wordmark';

/**
 * The header's left cluster: wordmark, a vertical hairline, the run's own
 * one-liner, and the run ledger beneath it.
 *
 * The one-liner truncates with an ellipsis and carries `title` so a sighted
 * reader can recover the full string. **No `aria-label`** — CSS truncation
 * does not truncate the accessibility tree, so the full text is already
 * announced and a label would only duplicate it.
 */
export function RunIdentity({
  oneLiner,
  metaParts,
}: { slug: string; oneLiner: string; metaParts: string[] }) {
  return (
    <div className="ob-run-identity">
      <div className="flex min-w-0 items-center gap-3">
        <Wordmark size="sm" />
        <hr className="ob-rule-v" />
        <span className="ob-run-oneliner" title={oneLiner}>
          {oneLiner}
        </span>
      </div>
      <MetaLine parts={metaParts} className="ob-run-meta" />
    </div>
  );
}
