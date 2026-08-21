/** Small mono label for a run's stage. 4px radius — **it is a chip, not a
 *  pill** (rule 8). */
export function StageChip({ stage, className = '' }: { stage: string; className?: string }) {
  return <span className={['ob-chip', className].filter(Boolean).join(' ')}>{stage}</span>;
}
