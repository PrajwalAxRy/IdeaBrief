import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds the hover lift. Only for cards that are themselves clickable. */
  interactive?: boolean;
  /** Amber ring, no background change — Surprise Panel, approved brief, expanded question. */
  featured?: boolean;
  padding?: 'compact' | 'feature' | 'none';
}

/** The base surface: no border, inset top highlight, outer shadow. Never nests — use Well instead. */
export function Card({
  interactive = false,
  featured = false,
  padding = 'compact',
  className = '',
  ...props
}: CardProps) {
  const paddingClass = padding === 'compact' ? 'p-6' : padding === 'feature' ? 'p-8' : '';
  const classes = [
    'card',
    interactive ? 'card--interactive' : '',
    featured ? 'card--featured' : '',
    paddingClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} {...props} />;
}
