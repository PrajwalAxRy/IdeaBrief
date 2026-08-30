import { Workspace } from '@/components/trial3/workspace';

/**
 * `/trial3` — concept route. Server Component; the single client boundary in
 * this tree is `Workspace`, and `{children}` reaching it through the layout is
 * the same arrangement `AccountProvider` has at the root.
 *
 * Throwaway, like `/experiment`: nothing links to it and nothing else imports
 * from `components/trial3/` or `lib/content/trial3.ts`. If the concept is
 * taken, its data moves behind the `lib/db/queries.ts` seam, its recipes move
 * out of `styles/audacity.css`, and this route goes.
 */
export default function Trial3Page() {
  return <Workspace />;
}
