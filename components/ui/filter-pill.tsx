'use client';

import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface FilterPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  active?: boolean;
  defaultActive?: boolean;
  onToggle?: (active: boolean) => void;
}

/** Toggleable pill — the Sources page's only filter UI, client-side. */
export function FilterPill({
  active,
  defaultActive = false,
  onToggle,
  className = '',
  children,
  ...props
}: FilterPillProps) {
  const [internalActive, setInternalActive] = useState(defaultActive);
  const isControlled = active !== undefined;
  const isActive = isControlled ? active : internalActive;

  function handleClick() {
    const next = !isActive;
    if (!isControlled) setInternalActive(next);
    onToggle?.(next);
  }

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={handleClick}
      className={['filter-pill', isActive ? 'filter-pill--active' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
