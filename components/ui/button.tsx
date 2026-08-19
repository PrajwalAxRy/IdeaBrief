import type { ButtonHTMLAttributes, Ref } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'md' | 'sm';
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Enforce one `variant="primary"` visible per viewport by convention, not by
 * code. Accepts `ref` as a plain React 19 prop so it can sit inside a Radix
 * `asChild` trigger (Dialog, Popover) without extra wrapping.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ref,
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    variant === 'primary' ? 'btn-primary' : 'btn-secondary',
    size === 'sm' ? 'btn-sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button ref={ref} type="button" className={classes} {...props} />;
}
