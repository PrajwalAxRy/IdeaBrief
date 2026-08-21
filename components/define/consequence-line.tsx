import { BRIEF } from '@/lib/content/app';

/**
 * What approving right now costs, in words, beside the button (D12).
 *
 * The count is derived, never typed: "unanswered" is fields marked unknown
 * **plus** fields the conversation has not yet reached, which is why the line
 * moves while you talk. `aria-live="polite"` because that movement is the
 * feedback.
 */
export function ConsequenceLine({ unanswered }: { unanswered: number }) {
  return (
    <p className="ob-consequence" aria-live="polite">
      {BRIEF.consequence(unanswered)}
    </p>
  );
}
