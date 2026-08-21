import type { Ref, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** `composer` maps onto the landing page's existing `.ob-composer textarea`
   *  (18px / 1.55). */
  variant?: 'field' | 'composer';
  minRows?: number;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Auto-grows via CSS `field-sizing: content` rather than a JS height-measure
 * hook, which keeps it a plain hook-free server component. Accepts `ref` as a
 * plain React 19 prop so callers can focus it imperatively.
 */
export function TextArea({
  variant = 'field',
  minRows = 3,
  className = '',
  ref,
  ...props
}: TextAreaProps) {
  const classes = [variant === 'composer' ? 'ob-composer' : 'ob-inline-input', className]
    .filter(Boolean)
    .join(' ');

  return <textarea ref={ref} rows={minRows} className={classes} {...props} />;
}
