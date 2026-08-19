import type { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** `hero` is The Box's variant: 18px type, larger padding, stronger focus glow. */
  variant?: 'default' | 'hero';
  minRows?: number;
}

/**
 * Auto-grows via CSS `field-sizing: content` (styles/components.css) rather
 * than a JS height-measure hook — keeps this a plain, hook-free component so
 * it stays out of the 13-component 'use client' budget. Powers The Box and
 * the Composer, which differ only in props.
 */
export function TextArea({
  variant = 'default',
  minRows = 3,
  className = '',
  ...props
}: TextAreaProps) {
  const classes = ['textarea', variant === 'hero' ? 'textarea--hero' : '', className]
    .filter(Boolean)
    .join(' ');

  return <textarea rows={minRows} className={classes} {...props} />;
}
