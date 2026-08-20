import { upsertRecentRun } from '@/lib/hooks/use-recent-runs';

const IDEA_STORAGE_PREFIX = 'sv.idea.';

/**
 * Prototype version of what will become a real server action — generates a
 * slug, writes the typed text to `localStorage`, records the run in Recent
 * Runs, and returns the slug for the caller to navigate to. No network call
 * happens here, so the "run creation failed" error state from `05` is
 * structurally unreachable in this prototype — deferred to P10's state-matrix
 * sweep like the rest of this page's simulated-failure UI.
 */
export function createRun(ideaText: string): string {
  const slug = crypto.randomUUID().replace(/-/g, '').slice(0, 10);

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(`${IDEA_STORAGE_PREFIX}${slug}`, ideaText);
  }

  upsertRecentRun({
    slug,
    oneLiner: ideaText,
    stage: 'define',
    updatedAt: new Date().toISOString(),
  });

  return slug;
}

/** The Define page's decision-#6 override: prefer the freshly-typed idea over the canonical fixture's. */
export function readStoredIdeaText(slug: string): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(`${IDEA_STORAGE_PREFIX}${slug}`);
}
