/**
 * A single breathing ambient field. Pure CSS, no state. `dimmed` recedes it
 * while something else is moving — one thing moves at a time.
 *
 * **Exactly one call site survives this build:** A14's invalid-run page. A8
 * removes the console's, because the per-page `AppBackdrop` replaces it there.
 */
export function Orb({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className={['ob-orb', dimmed ? 'ob-orb-dimmed' : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}
