'use client';

import { useScrollSpy } from '@/lib/hooks/use-scroll-spy';

export interface SegmentedControlItem {
  id: string;
  label: string;
}

/**
 * Sticky, scroll-jump orientation control for the Roadmap's two sections —
 * deliberately not tabs: both sections stay mounted and visible at all times
 * so the Dependency Chip wiring between them keeps working. Reuses the same
 * `useScrollSpy` primitive as `SectionIndex` (the Report's sidebar) rather
 * than a second implementation.
 */
export function SegmentedControl({ items }: { items: SegmentedControlItem[] }) {
  const [activeId, setActiveId] = useScrollSpy(items.map((item) => item.id));

  function handleClick(id: string) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="segmented-control" aria-label="Roadmap sections">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={activeId === item.id}
          className={[
            'segmented-control-item',
            activeId === item.id ? 'segmented-control-item--active' : '',
          ]
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
