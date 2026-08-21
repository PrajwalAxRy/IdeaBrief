'use client';

import { useState } from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface FilterPillProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onToggle'> {
  active?: boolean;
  defaultActive?: boolean;
  onToggle?: (active: boolean) => void;
  /** Printed as a mono suffix — the facet rail needs live counts. */
  count?: number;
}

/**
 * Keeps the contract name, but **it is not a pill** — it renders `.ob-toggle`
 * at 4px, because rule 8 permits a pill radius only on `.ob-btn`. A filter is a
 * chip.
 *
 * `[aria-pressed='true']` takes the accent border: that is blue's active-state
 * job, and one of only three things blue is allowed to mean.
 */
export function FilterPill({
  active,
  defaultActive = false,
  onToggle,
  count,
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
      className={['ob-toggle', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
      {count === undefined ? null : <span className="ob-toggle-count">{count}</span>}
    </button>
  );
}
