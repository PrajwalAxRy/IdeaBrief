import { Spinner } from '@/components/ui/spinner';
import { BRIEF } from '@/lib/content/app';

/**
 * The page's one `.ob-btn-primary`, full width of the aside foot.
 *
 * **Absent before `coreFilled`, never disabled** (D12) — the caller does not
 * render it at all until the conversation has reached the five core fields.
 * Talking past that point is optional, which is the whole reason it appears
 * early.
 *
 * There is no confirmation `Modal`: approving is a direct action, and a dialog
 * over a decision the product explicitly tells you it is fine to take early
 * would contradict D12.
 */
export function ApproveButton({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <div className="ob-approve">
      <button
        type="button"
        className="ob-btn ob-btn-primary w-full justify-center"
        onClick={onClick}
        disabled={pending}
      >
        {pending ? (
          <>
            <Spinner size={14} />
            {BRIEF.approving}
          </>
        ) : (
          BRIEF.approve
        )}
      </button>
      <p className="ob-approve-note">{BRIEF.approveNote}</p>
    </div>
  );
}
