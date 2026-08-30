import { Workspace } from '@/components/trial4/workspace';

/**
 * `/trial4` — concept route. Server Component; the client boundaries in this
 * tree are `Workspace` and `Thread`, and nothing else.
 *
 * Throwaway, like `/experiment` and the three trials before it: nothing links
 * to it, and nothing else imports from `components/trial4/`,
 * `lib/content/trial4.ts` or `styles/trial4.css`. If the concept is taken, its
 * data moves behind the `lib/db/queries.ts` seam, its recipes move into
 * `styles/obsidian-app.css`, and this route goes.
 */
export default function Trial4Page() {
  return <Workspace />;
}
