import { Button } from '@/components/ui/button';

/**
 * The one-tap "I don't know" — present from the first question, always.
 * Its own component because it carries product meaning, not just a click
 * handler (see 06 "The Don't-Know Button").
 */
export function DontKnowButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      I don't know
    </Button>
  );
}
