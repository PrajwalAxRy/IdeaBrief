/**
 * Account-surface copy — `/sign-in`, `/runs`, `/account`, `/pricing`, and the
 * account affordances in both chromes.
 *
 * Static app copy, imported directly, not routed through `lib/db/queries.ts` —
 * the same sanctioned exception `lib/content/app.ts` and `lib/content/landing.ts`
 * already take. The run seam stands in for Postgres reads of a run; page
 * furniture will never come from there.
 *
 * The two rules `lib/content/app.ts` states apply here unchanged: **no label
 * map** (a fourth vocabulary for the same thing is how R14 came back) and **no
 * Tailwind class name** (`tailwind.config.ts`'s `content` globs cover `app/`
 * and `components/` and deliberately not `lib/`, so a class written here is
 * never scanned and silently does nothing).
 *
 * Page copy arrives with its page — A20 ships only what A20 renders plus the
 * chrome labels A25 is committed to.
 */

/* ------------------------------------------------------------- identity --- */

/**
 * The identity an OAuth sign-in resolves to.
 *
 * **Not a fixture, and not behind the db seam, on purpose.** In a real product
 * this address arrives inside the provider's token — it is never read from our
 * own database — so a `lib/fixtures/accounts.ts` fronted by
 * `getAccount(id: string)` would be faking a seam for a read that does not
 * exist. `lib/account-state.ts`'s module doc carries the full argument.
 *
 * `example.com` is reserved by RFC 2606 for exactly this and can never route to
 * a real person.
 */
export const DEMO_IDENTITY = {
  email: 'ada@example.com',
  displayName: 'Ada',
} as const;

/* --------------------------------------------------------------- chrome --- */

/**
 * What the account affordance says in each chrome. Both are bare text actions,
 * never a filled button: `site-nav.tsx` records A15 demoting that cluster to
 * ghost because two filled blue buttons were in view at once, which is standing
 * rule 11's exact failure.
 *
 * There is no avatar label because there is no avatar. No dropdown-menu package
 * is installed (standing rule 18), no avatar recipe exists, and the system's
 * shape vocabulary is squares — `.ob-stage-node` is documented as "a 7px
 * square, never a circle or a pill".
 */
export const ACCOUNT_CHROME = {
  signIn: 'Sign in',
  signOut: 'Sign out',
  yourRuns: 'Your runs',
  account: 'Account',
  pricing: 'Pricing',
} as const;
