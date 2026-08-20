'use client';

import { useScrollSpy } from '@/lib/hooks/use-scroll-spy';
import type { MouseEvent, ReactNode } from 'react';

export interface SectionIndexItem {
  id: string;
  label: string;
}

/**
 * Sticky scrollspy list for long documents — the Report only. Accent
 * left-tick on the active entry; clicking scroll-jumps
 * (`scrollIntoView({behavior:'smooth'})`, per 11.4) rather than relying on
 * a bare anchor jump.
 */
export function SectionIndex({ items, meta }: { items: SectionIndexItem[]; meta?: ReactNode }) {
  const [activeId, setActiveId] = useScrollSpy(items.map((item) => item.id));

  function handleClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
    event.preventDefault();
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <nav className="section-index" aria-label="Report sections">
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(event) => handleClick(event, item.id)}
              className={[
                'section-index-link',
                activeId === item.id ? 'section-index-link--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {meta && <div className="section-index-meta">{meta}</div>}
    </nav>
  );
}
