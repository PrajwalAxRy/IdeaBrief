import type { ButtonHTMLAttributes, Ref } from 'react';

interface TextActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
}

/** The default tertiary action — used far more than `Button` in this product. */
export function TextAction({ className = '', ref, ...props }: TextActionProps) {
  return (
    <button
      ref={ref}
      type="button"
      className={['ob-text-action', className].filter(Boolean).join(' ')}
      {...props}
    />
  );
}
