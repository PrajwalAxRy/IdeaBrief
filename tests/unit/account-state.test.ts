import {
  type AccountPatch,
  accountIdFor,
  createAccountPatch,
  displayNameFor,
  isPlausibleEmail,
} from '@/lib/account-state';
import { DEMO_IDENTITY } from '@/lib/content/account';
import { describe, expect, it, vi } from 'vitest';

const AT = '2026-08-24T10:00:00.000Z';

describe('account-state — identity derivation', () => {
  it('resolves the same account id for the same address, however it is typed', () => {
    /* Deterministic on purpose. `createRun` mints a random slug because two
       runs of one idea are two runs; two sign-ins with one email are the same
       person, and a random id hands them an empty /runs every time. */
    const canonical = accountIdFor('ada@example.com');
    expect(accountIdFor('  ADA@Example.com  ')).toBe(canonical);
    expect(accountIdFor('ada@example.com')).toBe(canonical);
  });

  it('resolves a different account for a different address', () => {
    expect(accountIdFor('ada@example.com')).not.toBe(accountIdFor('grace@example.com'));
  });

  it('mints an id matching the shape readAccount validates', () => {
    expect(accountIdFor('ada@example.com')).toMatch(/^acct_[0-9a-f]{8}$/);
    expect(accountIdFor('')).toMatch(/^acct_[0-9a-f]{8}$/);
  });

  it('derives a display name from the local part, never the raw address', () => {
    expect(displayNameFor('ada@example.com')).toBe('Ada');
    expect(displayNameFor('ada.lovelace@example.com')).toBe('Ada');
    expect(displayNameFor('ada+notes@example.com')).toBe('Ada');
    expect(displayNameFor('ADA@EXAMPLE.COM')).toBe('Ada');
  });

  it('falls back to You rather than to something unreadable', () => {
    expect(displayNameFor('')).toBe('You');
    expect(displayNameFor('@example.com')).toBe('You');
    expect(displayNameFor('123@example.com')).toBe('You');
  });

  it('accepts an address with something either side of an @ and a dot after it', () => {
    expect(isPlausibleEmail('ada@example.com')).toBe(true);
    expect(isPlausibleEmail('  ada+tag@sub.example.co.uk  ')).toBe(true);
  });

  it('rejects what a sign-in form must not accept', () => {
    expect(isPlausibleEmail('')).toBe(false);
    expect(isPlausibleEmail('ada')).toBe(false);
    expect(isPlausibleEmail('ada@example')).toBe(false);
    expect(isPlausibleEmail('ada @example.com')).toBe(false);
    expect(isPlausibleEmail('a@b.c')).toBe(false); // under the length floor
    expect(isPlausibleEmail('ada@@example.com')).toBe(false);
  });

  it('sends both OAuth methods to one identity, and the emailed link to its own', () => {
    /* Real OAuth links providers on a matching verified email, so Google and
       GitHub landing on one account is the accurate behaviour, not a shortcut. */
    const google = createAccountPatch('google', undefined, AT);
    const github = createAccountPatch('github', undefined, AT);
    expect(google.id).toBe(github.id);
    expect(google.email).toBe(DEMO_IDENTITY.email);
    expect(google.displayName).toBe(DEMO_IDENTITY.displayName);
    expect(google.method).toBe('google');
    expect(github.method).toBe('github');

    const emailed = createAccountPatch('email', 'grace@example.com', AT);
    expect(emailed.id).not.toBe(google.id);
    expect(emailed.email).toBe('grace@example.com');
    expect(emailed.displayName).toBe('Grace');
  });

  it('ignores an address handed to an OAuth sign-in', () => {
    const patch = createAccountPatch('google', 'someone-else@example.com', AT);
    expect(patch.email).toBe(DEMO_IDENTITY.email);
  });
});

describe('account-state — the storage seam', () => {
  /**
   * `vi.stubGlobal('window', …)` then a **dynamic** import, exactly as
   * `brief-state.test.ts:115-137` does it. A static import at the top of the
   * file captures the unstubbed global and every assertion here silently tests
   * the `typeof window === 'undefined'` branch instead.
   */
  async function withStorage(
    run: (store: Map<string, string>, mod: typeof import('@/lib/account-state')) => Promise<void>,
    { throwOnSet = false }: { throwOnSet?: boolean } = {},
  ) {
    const store = new Map<string, string>();
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          if (throwOnSet) throw new Error('QuotaExceededError');
          store.set(k, v);
        },
        removeItem: (k: string) => void store.delete(k),
      },
    });

    try {
      await run(store, await import('@/lib/account-state'));
    } finally {
      vi.unstubAllGlobals();
    }
  }

  it('round-trips a signed-in account', async () => {
    await withStorage(async (_store, mod) => {
      const written = mod.signIn('email', 'grace@example.com');
      const read = mod.readAccount();
      expect(read).toEqual(written);
      expect(read?.v).toBe(1);
    });
  });

  it('discards a payload whose v is not 1 rather than migrating it', async () => {
    await withStorage(async (store, mod) => {
      const patch = mod.signIn('github');
      expect(mod.readAccount()?.id).toBe(patch.id);

      store.set('sv.account', JSON.stringify({ ...patch, v: 2 }));
      expect(mod.readAccount()).toBeNull();
    });
  });

  it('discards a malformed payload rather than half-reading it', async () => {
    await withStorage(async (store, mod) => {
      const base = mod.createAccountPatch('email', 'ada@example.com', AT);

      const bad: Record<string, unknown>[] = [
        { ...base, id: 'not-an-account-id' },
        { ...base, method: 'saml' },
        { ...base, email: '' },
        { ...base, displayName: '' },
        { ...base, signedInAt: 1756000000000 },
      ];

      for (const payload of bad) {
        store.set('sv.account', JSON.stringify(payload));
        expect(mod.readAccount()).toBeNull();
      }

      /* The unmutated original still reads, so the cases above failed on the
         mutation rather than on something the whole shape gets wrong. */
      store.set('sv.account', JSON.stringify(base));
      expect(mod.readAccount()).not.toBeNull();
    });
  });

  it('reads null rather than throwing on absent or unparseable storage', async () => {
    await withStorage(async (store, mod) => {
      expect(mod.readAccount()).toBeNull();
      store.set('sv.account', '{ not json');
      expect(mod.readAccount()).toBeNull();
    });
  });

  it('signs out by clearing sv.account and nothing else', async () => {
    await withStorage(async (store, mod) => {
      store.set('sv.runs', '[{"slug":"abc"}]');
      store.set('sv.brief.abc', '{"v":1}');
      mod.signIn('google');

      mod.signOut();

      expect(mod.readAccount()).toBeNull();
      /* Clearing these would destroy an anonymous visitor's work the moment
         they signed out of someone else's account. */
      expect(store.get('sv.runs')).toBe('[{"slug":"abc"}]');
      expect(store.get('sv.brief.abc')).toBe('{"v":1}');
    });
  });

  it('surfaces a failed sign-in write instead of swallowing it', async () => {
    /* The deliberate deviation from the house convention. Every other write in
       the codebase no-ops silently on a full or disabled store; a Sign in
       button that appears to do nothing in Safari private mode is a broken
       demo with no visible cause. */
    await withStorage(
      async (_store, mod) => {
        expect(() => mod.signIn('google')).toThrow();
      },
      { throwOnSet: true },
    );
  });

  it('refuses an emailed-link sign-in it cannot resolve an identity from', async () => {
    await withStorage(async (_store, mod) => {
      expect(() => mod.signIn('email', 'nope')).toThrow();
      expect(() => mod.signIn('email')).toThrow();
      expect(mod.readAccount()).toBeNull();
    });
  });

  it('is inert on the server rather than throwing', async () => {
    /* Every accessor is guarded, so importing this module into a Server
       Component is safe even though nothing there should call it. */
    const mod = await import('@/lib/account-state');
    const patch: AccountPatch = mod.createAccountPatch('google', undefined, AT);
    expect(patch.email).toBe(DEMO_IDENTITY.email);
    expect(mod.readAccount()).toBeNull();
    expect(() => mod.signOut()).not.toThrow();
  });
});
