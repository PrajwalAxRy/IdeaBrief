/**
 * The scope arithmetic behind R13 — pure, and tested.
 *
 * R13 was: the drawer's `←`/`→` walked the full 47-item corpus **ignoring the
 * active filter**, with no position readout. So filtering `/sources` to the 13
 * MONEY findings and pressing Next took you to a PROBLEM finding that was
 * nowhere on screen, and nothing told you where in anything you were.
 *
 * The fix is one idea: a filtering surface publishes its visible, ordered ids
 * as the **scope**, and the walk indexes into that list and nothing else. The
 * default scope is the 47 verified ids, which is what stops a chip clicked in
 * report prose from ever walking into a discard — `/sources` is the only
 * surface where a walk crosses record kinds, because there the discards are on
 * screen between the verified rows and crossing is the page's whole argument.
 */

export interface EffectiveScope {
  ids: string[];
  filtered: boolean;
}

/**
 * **The guard that matters:** if the open id is not in `scope` — you clicked a
 * citation in prose while a filter is live on another surface — the walk falls
 * back to the full corpus for that one open, and `filtered` is `false`. It
 * must never dead-end at a disabled Prev and a disabled Next.
 */
export function effectiveScope(
  scope: string[] | null,
  allIds: string[],
  openId: string | null,
): EffectiveScope {
  if (!scope || scope.length === 0) return { ids: allIds, filtered: false };
  if (openId !== null && !scope.includes(openId)) return { ids: allIds, filtered: false };
  return { ids: scope, filtered: scope.length !== allIds.length };
}

/** 1-based position within `ids`, or `null` when the id isn't in the list. */
export function positionOf(ids: string[], id: string): { index: number; total: number } | null {
  const at = ids.indexOf(id);
  if (at === -1) return null;
  return { index: at + 1, total: ids.length };
}

/** `null` at either end. **There is no wrapping** — a corpus you can loop is a
 *  corpus you can't finish reading. */
export function step(ids: string[], id: string, delta: number): string | null {
  const at = ids.indexOf(id);
  if (at === -1) return null;
  const next = at + delta;
  if (next < 0 || next >= ids.length) return null;
  return ids[next];
}
