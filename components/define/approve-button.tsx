import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

/**
 * `.btn-primary`, full-width in the panel — enabled the moment the AI has
 * proposed a brief, not when the conversation "finishes." Absent (not
 * disabled) before that point, since there's nothing to approve yet.
 */
export function ApproveButton({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Button className="w-full justify-center" onClick={onClick} disabled={pending}>
        {pending ? (
          <>
            <Spinner size={16} />
            Starting research…
          </>
        ) : (
          'Approve and research'
        )}
      </Button>
      <span className="meta-line">Takes about 5 minutes.</span>
    </div>
  );
}
