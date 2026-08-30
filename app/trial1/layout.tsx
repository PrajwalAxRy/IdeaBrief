import type { Metadata } from 'next';

/* Riley, loaded here rather than in `styles/globals.css`.
 *
 * Next only ships a nested layout's CSS on the routes beneath it, so this pair
 * costs every obsidian route nothing and touches no shared file — which is also
 * what lets /trial2 and /trial3 be built in parallel without three processes
 * editing one stylesheet.
 *
 * `layer(components)` is not optional. Unlayered, `.rl-card { margin: 0 }` beats
 * every Tailwind spacing utility on the same element regardless of specificity,
 * with no error and a page that still looks plausible. The layer names are
 * already declared by Tailwind via `globals.css`, so these slot into the
 * existing order rather than starting a new one. */
import '@/styles/trial1/tokens.css';
import '@/styles/trial1/riley.css';

export const metadata: Metadata = {
  title: 'Define — trial 1',
  description: 'Workspace layout trial: chat history, conversation, and a standing summary.',
};

export default function Trial1Layout({ children }: { children: React.ReactNode }) {
  return children;
}
