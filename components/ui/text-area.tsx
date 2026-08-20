import type { Ref, TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** `hero` is The Box's variant: 18px type, larger padding, stronger focus glow. */
  variant?: 'default' | 'hero';
  minRows?: number;
  ref?: Ref<HTMLTextAreaElement>;
}

/**
 * Auto-grows via CSS `field-sizing: content` (styles/components.css) rather
 * than a JS height-measure hook — keeps this a plain, hook-free component so
 * it stays out of the 13-component 'use client' budget. Powers The Box and
 * the Composer, which differ only in props. Accepts `ref` as a plain React 19
 * prop (mirrors Button/IconButton/TextAction) so callers can focus it
 * imperatively — e.g. The Box's page-load focus and example-seed fill.
 */
export function TextArea({
  variant = 'default',
  minRows = 3,
  className = '',
  ref,
  ...props
}: TextAreaProps) {
  const classes = ['textarea', variant === 'hero' ? 'textarea--hero' : '', className]
    .filter(Boolean)
    .join(' ');

  return <textarea ref={ref} rows={minRows} className={classes} {...props} />;
}
