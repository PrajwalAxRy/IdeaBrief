import type { Config } from 'tailwindcss';

/**
 * Layout utilities only — flex, grid, spacing, sizing.
 * All colour, shadow, glow, border, and typography come from styles/tokens.css
 * and styles/components.css. Do not add a `colors` key here.
 */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        marketing: '1200px',
        app: '1360px',
        prose: '68ch',
        conversation: '64ch',
      },
    },
  },
} satisfies Config;
