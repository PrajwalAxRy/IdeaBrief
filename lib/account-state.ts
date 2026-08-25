import { DEMO_IDENTITY } from './content/account';

/**
 * The account (D21–D28) — and **this file is the seam**, in exactly the sense
 * `lib/brief-state.ts` is one.
 *
 * There is no `lib/db/account-queries.ts` and no account fixture, deliberately.
 * Nothing server-side in this prototype can see an account: the identity lives
 * in `localStorage`, and `lib/db/queries.ts` is consumed from Server
 * Components, which cannot read it. A `(id: string) => Promise<Account>` beside
 * the run seam would have exactly one fixture, zero callers, and would fake a
 * seam for a read that never happens — the same mistake
 * `only_frontend_build_plan.md` records for marketing copy. When a server
 * consumer arrives, it arrives with the file.
 *
 * The seam that *is* real is the four storage functions below. A backend
 * replaces `readAccount`/`writeAccount`/`clearAccount`/`signIn` with a session
 * cookie and `POST /api/auth/session`, and nothing else in the tree changes —
 * everything above them is pure and node-testable.
 *
 * **This is not security and must never be mistaken for it.** The Next 16 docs
 * are explicit that a layout hiding a segment "does not stop [it] from running
 * or from appearing in the RSC Payload" — client-side gating is decorative. The
 * one place the account is consulted (the Approve gate, A22) is a *product*
 * decision rendered in the browser, not an access control.
 *
 * **Naming.** `Account`, never `Session`. `Session` is taken nine ways over —
 * `IdeaSession`, `ValidateSession`, `SESSION_SCRIPT`, `sessionStepMs`,
 * `sessionTotalMs`, and nine `.ob-session-*` classes in `styles/obsidian.css`
 * §11 — and standing rule 19 makes glossary names binding.
 */

export const ACCOUNT_STORAGE_KEY = 'sv.account';

/** D26: Google, GitHub, or an emailed link. There are no passwords anywhere. */
export type AuthMethod = 'google' | 'github' | 'email';

export const AUTH_METHODS: readonly AuthMethod[] = ['google', 'github', 'email'] as const;

export interface AccountPatch {
  v: 1;
  id: string;
  email: string;
  displayName: string;
  method: AuthMethod;
  /** ISO. */
  signedInAt: string;
}

/* ------------------------------------------------------------- identity --- */

const ACCOUNT_ID_PATTERN = /^acct_[0-9a-f]{8}$/;

/**
 * FNV-1a over the normalised email, rendered as eight hex characters.
 *
 * **Deterministic on purpose.** `createRun` mints a random slug because two
 * runs of the same idea are two runs; two sign-ins with the same email are the
 * same person, and a random id would hand them an empty `/runs` every time they
 * signed back in. A hash also gives the demo a genuinely useful property: a
 * second email is a second account with its own list, with no persona switcher
 * to build.
 */
export function accountIdFor(email: string): string {
  const normalised = email.trim().toLowerCase();
  let hash = 0x811c9dc5;
  for (let i = 0; i < normalised.length; i += 1) {
    hash ^= normalised.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `acct_${hash.toString(16).padStart(8, '0')}`;
}

/**
 * `ada.lovelace@example.com` → `Ada`. A real backend gets a display name from
 * the OAuth profile; the emailed-link path has nothing but the address, so this
 * is what that path would honestly do.
 *
 * Falls back to `You` rather than to the raw address: a header reading
 * "a.b+tag@example.com" is worse than one reading "You".
 */
export function displayNameFor(email: string): string {
  const local = email.trim().toLowerCase().split('@')[0] ?? '';
  const first = local.split(/[^a-z]+/i).find(Boolean);
  if (!first) return 'You';
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/**
 * Pure — builds the payload without touching storage, so the whole identity
 * derivation is node-testable and the storage call is the only impure step.
 *
 * OAuth resolves to `DEMO_IDENTITY` because in a real product that address
 * comes back inside the provider's token, not from our database. Both providers
 * land on the same account, which is what real OAuth does when the verified
 * email matches.
 */
export function createAccountPatch(
  method: AuthMethod,
  email: string | undefined,
  signedInAt: string,
): AccountPatch {
  const resolved = method === 'email' ? (email ?? '').trim() : DEMO_IDENTITY.email;

  return {
    v: 1,
    id: accountIdFor(resolved),
    email: resolved,
    displayName: method === 'email' ? displayNameFor(resolved) : DEMO_IDENTITY.displayName,
    method,
    signedInAt,
  };
}

/**
 * The one place an address is judged good enough to sign in with.
 *
 * Deliberately not an RFC-5322 regex. The strictest realistic check a prototype
 * can make is "there is something either side of an `@` and a dot after it";
 * anything tighter rejects real addresses, and there is no inbox to be wrong
 * about.
 */
export function isPlausibleEmail(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length < 6 || trimmed.length > 254) return false;
  if (/\s/.test(trimmed)) return false;
  return /^[^@]+@[^@.]+\.[^@]+$/.test(trimmed);
}

/* ------------------------------------------------------------- the seam --- */

/**
 * A payload whose `v !== 1` is discarded, not migrated — the `BriefPatch`
 * precedent (`lib/brief-state.ts:211`). Discarding an account costs a sign-in;
 * migrating a shape nobody remembers costs a bug.
 */
export function readAccount(): AccountPatch | null {
  if (typeof window === 'undefined') return null;

  let raw: string | null;
  try {
    raw = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const candidate = parsed as Record<string, unknown>;
    if (candidate.v !== 1) return null;
    if (typeof candidate.id !== 'string' || !ACCOUNT_ID_PATTERN.test(candidate.id)) return null;
    if (typeof candidate.email !== 'string' || candidate.email.length === 0) return null;
    if (typeof candidate.displayName !== 'string' || candidate.displayName.length === 0) {
      return null;
    }
    if (!AUTH_METHODS.includes(candidate.method as AuthMethod)) return null;
    if (typeof candidate.signedInAt !== 'string') return null;

    return {
      v: 1,
      id: candidate.id,
      email: candidate.email,
      displayName: candidate.displayName,
      method: candidate.method as AuthMethod,
      signedInAt: candidate.signedInAt,
    };
  } catch {
    return null;
  }
}

/**
 * **This one throws, and that is the deliberate deviation.**
 *
 * Every other write in this codebase swallows its failure — `writeBriefPatch`,
 * `upsertRecentRun` and `dismissHint` all no-op silently on a full or disabled
 * store, because the feature still works for the session and there is no
 * durability promise to break. Sign-in is different: a Sign in button that
 * appears to do nothing in Safari private mode is a broken demo with no visible
 * cause. The caller surfaces it.
 */
export function writeAccount(patch: AccountPatch): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(patch));
}

export function clearAccount(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ACCOUNT_STORAGE_KEY);
  } catch {
    /* Nothing to promise here — a sign-out that cannot write is a sign-out
       that will be undone by the next read, and there is no worse outcome
       available than leaving them signed in. */
  }
}

/**
 * Sign in. The interface a real `POST /api/auth/session` satisfies: it takes a
 * method and an optional address, and it resolves an identity.
 *
 * Throws if the write fails (see `writeAccount`) or if an emailed-link sign-in
 * is handed an address it cannot use. Both are surfaced by the caller.
 *
 * **Sign-out clears `sv.account` and nothing else.** `sv.runs`, `sv.brief.*`,
 * `sv.idea.*` and `sv.runStarted.*` carry no notion of who wrote them, and
 * clearing them would destroy an anonymous visitor's work the moment they
 * signed out of someone else's account.
 */
export function signIn(method: AuthMethod, email?: string): AccountPatch {
  if (method === 'email' && !isPlausibleEmail(email ?? '')) {
    throw new Error('signIn: an emailed-link sign-in needs a plausible address');
  }

  const patch = createAccountPatch(method, email, new Date().toISOString());
  writeAccount(patch);
  return patch;
}

export function signOut(): void {
  clearAccount();
}
