import type { ButtonHTMLAttributes, Ref } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'bare';
  size?: 'md' | 'sm';
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Exactly one `variant="primary"` visible per viewport — enforced by review,
 * not by code, and verifiable (references/verification.md §6).
 *
 * `.ob-btn:focus-visible` carries `transition: none` in obsidian.css §4. Do not
 * remove it: a ring that fades over 320ms reads as lag.
 *
 * Accepts `ref` as a plain React 19 prop so it can sit inside a Radix `asChild`
 * trigger (Dialog, Popover) without extra wrapping.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ref,
  ...props
}: ButtonProps) {
  const classes = ['ob-btn', `ob-btn-${variant}`, size === 'sm' ? 'ob-btn-sm' : '', className]
    .filter(Boolean)
    .join(' ');

  return <button ref={ref} type="button" className={classes} {...props} />;
}
