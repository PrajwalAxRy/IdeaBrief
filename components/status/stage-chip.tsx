/** Small mono label for a run's stage — Recent Runs list. */
export function StageChip({ stage, className = '' }: { stage: string; className?: string }) {
  return <span className={['stage-chip', className].filter(Boolean).join(' ')}>{stage}</span>;
}
