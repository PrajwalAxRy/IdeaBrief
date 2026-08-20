import type { StageState, StageStates } from '@/lib/run-stage';
import Link from 'next/link';

const STAGES: { key: keyof StageStates; label: string; href: string; lockedHint: string }[] = [
  {
    key: 'define',
    label: 'Define',
    href: 'define',
    lockedHint: 'Start the conversation to unlock Define.',
  },
  {
    key: 'validate',
    label: 'Validate',
    href: 'validate',
    lockedHint: 'Approve the brief to unlock Validate.',
  },
  {
    key: 'roadmap',
    label: 'Roadmap',
    href: 'roadmap',
    lockedHint: 'Finish the research to unlock the roadmap.',
  },
];

function nodeGlyph(state: StageState): string {
  if (state === 'done') return '✓';
  if (state === 'active') return '●';
  return '○';
}

/**
 * Primary navigation. Locked segments carry no affordance at all — dim
 * text, hollow node, no hover, no click, just a `title` explaining what
 * unlocks them. Never a disabled link.
 */
export function StageRail({ slug, stageStates }: { slug: string; stageStates: StageStates }) {
  return (
    <ol className="stage-rail">
      {STAGES.map((stage) => {
        const state = stageStates[stage.key];
        const content = (
          <>
            <span className="stage-node">{nodeGlyph(state)}</span>
            <span className="stage-label">{stage.label}</span>
          </>
        );

        return (
          <li key={stage.key} className={`stage-segment stage-segment--${state}`}>
            {state === 'locked' ? (
              <span title={stage.lockedHint}>{content}</span>
            ) : (
              <Link href={`/r/${slug}/${stage.href}`}>{content}</Link>
            )}
          </li>
        );
      })}
    </ol>
  );
}
