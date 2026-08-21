'use client';

import { useScrollSpy } from '@/lib/hooks/use-scroll-spy';

export interface SegmentedControlItem {
  id: string;
  label: string;
}

/**
 * Scroll-jump orientation control for the Roadmap's two sections —
 * deliberately not tabs: both sections stay mounted and visible at all times
 * so the Dependency Chip wiring between them keeps working. Reuses the same
 * `useScrollSpy` primitive as `SectionIndex` (the Report's sidebar) rather
 * than a second implementation.
 *
 * Nothing here is a pill — that radius is buttons only (rule 8). The wrapper's
 * stickiness (R9) is A11's job, not this primitive's.
 */
export function SegmentedControl({ items }: { items: SegmentedControlItem[] }) {
  const [activeId, setActiveId] = useScrollSpy(items.map((item) => item.id));

  function handleClick(id: string) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="ob-segmented" aria-label="Roadmap sections">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={activeId === item.id}
          className={['ob-segmented-item', activeId === item.id ? 'ob-segmented-item--on' : '']
            .filter(Boolean)
            .join(' ')}
          onClick={() => handleClick(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
