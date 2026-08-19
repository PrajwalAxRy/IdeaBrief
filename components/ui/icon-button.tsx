import type { ButtonHTMLAttributes, Ref } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible label — required, since the visible content is icon-only. */
  label: string;
  ref?: Ref<HTMLButtonElement>;
}

/** React 19 accepts `ref` as a plain prop — no forwardRef needed, e.g. when Radix's `asChild` wraps this in a Tooltip. */
export function IconButton({ label, className = '', children, ref, ...props }: IconButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      className={['icon-btn', className].filter(Boolean).join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}
