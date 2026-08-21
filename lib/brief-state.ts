import {
  BRIEF_FIELD_KEYS,
  type Brief,
  type BriefFieldKey,
  type FieldStatus,
  isBriefListField,
} from './schemas/brief';

/**
 * The dynamic brief (D10) — the mechanic R5 and R6 both live in.
 *
 * The server fixture is a static, always-complete `Brief`. Everything the user
 * does on Define — reaching a field in conversation, marking one unknown,
 * retyping one, approving the whole thing — is *client* state that layers over
 * it. This module is that layer, and it is the seam: everything except the
 * four storage functions is pure and node-testable, so swapping them for
 * `GET`/`PATCH /api/brief/<slug>` is a four-function change that touches no
 * component.
 *
 * **There is exactly one function that resolves a field's displayed status,
 * and it is `resolveBrief`.** R6 exists because `valueFor()` short-circuited
 * `one_liner` past the override map, so an edit reverted *and* left an
 * `edited` marker behind. A single resolver makes that class of bug
 * unrepresentable.
 *
 * **There is exactly one storage key, `sv.brief.<slug>`**, and the edited
 * values live on the patch in `values` rather than in a second store. A
 * `resolveBrief(base, patch)` that had to reach a store could not, because a
 * patch carries no slug — and a patch with the values in it is a *more*
 * plausible `PATCH /api/brief` body, not less.
 */

export const BRIEF_STORAGE_PREFIX = 'sv.brief.';

/**
 * D12's gate: five of the twelve fields — what it is, who it is for, what is
 * broken, and what v1 covers. Everything else refines.
 *
 * `what_makes_this_different` is deliberately **not** one of them: it is a
 * positioning answer, not an input a research run needs to generate queries,
 * and including it pushed the gate from turn 5 to turn 7.
 */
export const CORE_BRIEF_FIELD_KEYS = [
  'one_liner',
  'product',
  'customer',
  'problem',
  'first_version_scope',
] as const satisfies readonly BriefFieldKey[];

export type BriefPatch = {
  v: 1;
  /** Fields the conversation has reached. */
  revealed: BriefFieldKey[];
  /** Fields marked unknown, by the user or the fixture. */
  unknown: BriefFieldKey[];
  /** Fields the user retyped. */
  edited: BriefFieldKey[];
  /** What they retyped them to. */
  values: Partial<Record<BriefFieldKey, string | string[]>>;
  /** ISO, set once. */
  approvedAt: string | null;
};

export type BriefAction =
  | { type: 'hydrate'; patch: BriefPatch }
  | { type: 'reveal'; key: BriefFieldKey }
  | { type: 'markUnknown'; key: BriefFieldKey }
  | { type: 'edit'; key: BriefFieldKey; value: string | string[] }
  | { type: 'approve'; at: string };

export function emptyBriefPatch(): BriefPatch {
  return { v: 1, revealed: [], unknown: [], edited: [], values: {}, approvedAt: null };
}

function withKey(list: BriefFieldKey[], key: BriefFieldKey): BriefFieldKey[] {
  return list.includes(key) ? list : [...list, key];
}

function withoutKey(list: BriefFieldKey[], key: BriefFieldKey): BriefFieldKey[] {
  return list.filter((k) => k !== key);
}

/** Never mutates its input. */
export function briefReducer(state: BriefPatch, action: BriefAction): BriefPatch {
  switch (action.type) {
    case 'hydrate':
      return action.patch;

    case 'reveal':
      return { ...state, revealed: withKey(state.revealed, action.key) };

    case 'markUnknown': {
      /* Marking a field unknown retracts any value the user typed into it —
         "I don't know" is an answer, and leaving the old text behind would
         make the panel show a value under an `unknown` status. */
      const { [action.key]: _dropped, ...values } = state.values;
      return {
        ...state,
        revealed: withKey(state.revealed, action.key),
        unknown: withKey(state.unknown, action.key),
        edited: withoutKey(state.edited, action.key),
        values,
      };
    }

    case 'edit':
      return {
        ...state,
        revealed: withKey(state.revealed, action.key),
        /* Typing a value into an unknown field answers it. */
        unknown: withoutKey(state.unknown, action.key),
        edited: withKey(state.edited, action.key),
        values: { ...state.values, [action.key]: action.value },
      };

    case 'approve':
      return state.approvedAt === null ? { ...state, approvedAt: action.at } : state;

    default:
      return state;
  }
}

/**
 * Apply a patch to the server's brief. Pure, two-argument, and has everything
 * it needs. The output still passes `BriefSchema` — a unit test says so.
 */
export function resolveBrief(base: Brief, patch: BriefPatch): Brief {
  /* Assembled loosely and cast once. Writing `next[key]` with `key` widened
     across the twelve-key union makes TypeScript demand the *intersection* of
     the string-valued and list-valued field types, which nothing can satisfy.
     The cast is the narrowest workaround; the shape is proved correct by
     `resolveBrief output still passes BriefSchema` in the unit tests. */
  const next: Record<string, { status: FieldStatus; value: string | string[] }> = {};

  for (const key of BRIEF_FIELD_KEYS) {
    const field = base[key];

    if (patch.unknown.includes(key)) {
      next[key] = { status: 'unknown', value: isBriefListField(key) ? [] : '' };
      continue;
    }

    const override = patch.values[key];
    if (override !== undefined) {
      next[key] = { status: 'filled', value: override };
      continue;
    }

    next[key] = {
      status: field.status === 'pending' && patch.revealed.includes(key) ? 'filled' : field.status,
      value: field.value,
    };
  }

  return next as Brief;
}

export function unknownKeys(base: Brief, patch: BriefPatch): BriefFieldKey[] {
  const resolved = resolveBrief(base, patch);
  return BRIEF_FIELD_KEYS.filter((key) => resolved[key].status === 'unknown');
}

export function answeredCount(base: Brief, patch: BriefPatch): number {
  const resolved = resolveBrief(base, patch);
  return BRIEF_FIELD_KEYS.filter((key) => resolved[key].status === 'filled').length;
}

export function unansweredCount(base: Brief, patch: BriefPatch): number {
  return unknownKeys(base, patch).length;
}

/**
 * D12's gate — the only function here with an opinion baked in, and the only
 * test of the threshold anywhere. True once the conversation has **reached**
 * each of the five core fields, whether it answered them or the user said "I
 * don't know": that is always an answer and never a blocker.
 *
 * **Reach is what is tested, not the base status.** An earlier version asked
 * only whether the resolved status was non-`pending`, which is vacuously true
 * on the real fixture — every field there ships `filled` or `unknown`, so the
 * gate opened on the first paint and `ApproveButton` was on screen before a
 * single question had been asked. The server brief is the *answer set*; the
 * patch is how far the conversation has got, and D12 gates on the second.
 */
export function coreFilled(base: Brief, patch: BriefPatch): boolean {
  const resolved = resolveBrief(base, patch);
  return CORE_BRIEF_FIELD_KEYS.every((key) => {
    const reached =
      patch.revealed.includes(key) ||
      patch.unknown.includes(key) ||
      patch.values[key] !== undefined;
    return reached && resolved[key].status !== 'pending';
  });
}

/* ------------------------------------------------------------- the seam --- */

function storageKey(slug: string): string {
  return `${BRIEF_STORAGE_PREFIX}${slug}`;
}

function isBriefFieldKeyArray(value: unknown): value is BriefFieldKey[] {
  return (
    Array.isArray(value) &&
    value.every((k) => (BRIEF_FIELD_KEYS as readonly string[]).includes(k as string))
  );
}

/** A payload whose `v !== 1` is discarded, not migrated. So is one missing
 *  `values` — it is malformed, not an older shape. */
export function readBriefPatch(slug: string): BriefPatch | null {
  if (typeof window === 'undefined') return null;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(storageKey(slug));
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const candidate = parsed as Record<string, unknown>;
    if (candidate.v !== 1) return null;
    if (!isBriefFieldKeyArray(candidate.revealed)) return null;
    if (!isBriefFieldKeyArray(candidate.unknown)) return null;
    if (!isBriefFieldKeyArray(candidate.edited)) return null;
    if (typeof candidate.values !== 'object' || candidate.values === null) return null;
    if (candidate.approvedAt !== null && typeof candidate.approvedAt !== 'string') return null;

    return {
      v: 1,
      revealed: candidate.revealed,
      unknown: candidate.unknown,
      edited: candidate.edited,
      values: candidate.values as BriefPatch['values'],
      approvedAt: candidate.approvedAt,
    };
  } catch {
    return null;
  }
}

export function writeBriefPatch(slug: string, patch: BriefPatch): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(storageKey(slug), JSON.stringify(patch));
  } catch {
    /* Private mode / quota. The brief still works for this session; the
       prototype has no other durability guarantee to break. */
  }
}
