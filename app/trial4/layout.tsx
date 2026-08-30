import type { Metadata } from 'next';

/* The recipes for this route, loaded here rather than added to
 * `styles/globals.css`. Next only ships a nested layout's CSS on the routes
 * beneath it, so this costs every other route nothing and touches no shared
 * import list — which is also what keeps the four trial routes independently
 * deletable.
 *
 * `layer(components)` is not optional, and here it is written INSIDE the file
 * (a JS `import` of a stylesheet cannot name a layer): every rule in
 * `trial4.css` sits in an `@layer components { … }` block. Unlayered, a
 * `.t4-rail { margin: 0 }` beats every Tailwind spacing utility on the same
 * element regardless of specificity, with no error and a page that still looks
 * plausible. The layer names are already declared by Tailwind via
 * `globals.css`, so this slots into the existing order rather than starting a
 * new one.
 *
 * **Unlike /trial1–/trial3 there is no theme wrapper and no second namespace.**
 * Those three each carry a rival light system, so every token they declare has
 * to be scoped to a wrapper — a second `:root` block would win on source order
 * and restyle the whole dark app. This route is Obsidian, which is already
 * global on `:root`, so it declares no token at all and every `.ob-*` recipe
 * works here as it stands.
 */
import '@/styles/trial4.css';

export const metadata: Metadata = {
  title: 'Define — trial 4',
  description:
    'An Obsidian workspace for the Define stage: previous conversations, the conversation itself, and the brief filling in as it is answered.',
};

export default function Trial4Layout({ children }: { children: React.ReactNode }) {
  return children;
}
