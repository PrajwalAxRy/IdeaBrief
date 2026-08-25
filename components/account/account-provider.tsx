'use client';

import {
  type AccountPatch,
  type AuthMethod,
  signIn as persistSignIn,
  signOut as persistSignOut,
  readAccount,
} from '@/lib/account-state';
import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * **Three states, not a nullable account.** `null` would conflate "we have not
 * looked yet" with "signed out", and those two render differently: the first is
 * a reserved-width slot holding nothing, the second is a Sign in link. Making
 * them one value is how a nav reflows on hydration.
 */
export type AccountState =
  | { status: 'unknown' }
  | { status: 'signed-out' }
  | { status: 'signed-in'; account: AccountPatch };

interface AccountContextValue {
  state: AccountState;
  /** Throws on a failed write or an unusable address — the caller surfaces it. */
  signIn: (method: AuthMethod, email?: string) => AccountPatch;
  signOut: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

const UNKNOWN: AccountState = { status: 'unknown' };
const SIGNED_OUT: AccountState = { status: 'signed-out' };

/**
 * The app's second global UI context, after `EvidenceProvider` — who is signed
 * in. Mounted once in `app/layout.tsx`, wrapping `{children}`.
 *
 * **Nothing below it joins the client bundle.** `children` arrives as a prop
 * already rendered on the server, which is the identical mechanism
 * `app/r/[slug]/layout.tsx:138` uses for `EvidenceProvider`. A `'use client'`
 * boundary marks where *this file's* code runs, not where the tree stops being
 * server-rendered.
 *
 * **`unknown` on the server and on the first client render, then widened in a
 * `useLayoutEffect`.** This is R24's prescribed shape, recorded verbatim in
 * `components/validate/validate-view.tsx:31-36`: a `useState(() => …)` that
 * read `localStorage` evaluated `false` on the server and `true` on the client,
 * "so the server rendered the Report and the client silently regenerated the
 * Console". A layout effect flushes before paint, so the chrome never flashes a
 * signed-out state at a signed-in visitor — never a `useEffect` (after paint,
 * one visible frame wrong), never during render (R8's disease).
 *
 * `'use client'` because it holds state, and the boundary is as deep as it can
 * go while still being one context: standing rule 22.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AccountState>(UNKNOWN);

  useLayoutEffect(() => {
    const stored = readAccount();
    setState(stored ? { status: 'signed-in', account: stored } : SIGNED_OUT);
  }, []);

  const signIn = useCallback((method: AuthMethod, email?: string) => {
    const account = persistSignIn(method, email);
    setState({ status: 'signed-in', account });
    return account;
  }, []);

  const signOut = useCallback(() => {
    persistSignOut();
    setState(SIGNED_OUT);
  }, []);

  const value = useMemo<AccountContextValue>(
    () => ({ state, signIn, signOut }),
    [state, signIn, signOut],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within an AccountProvider');
  return context;
}

/** The account itself, or `null` while unknown *or* signed out — for the many
 *  call sites that treat those two the same and only want the identity. */
export function useAccountPatch(): AccountPatch | null {
  const { state } = useAccount();
  return state.status === 'signed-in' ? state.account : null;
}
