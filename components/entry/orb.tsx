/**
 * Single elliptical, breathing orb — bottom-centre, behind the box/CTA. Pure
 * CSS, no state. `dimmed` is the Run Console's variant (11.7.5: "one thing
 * moves at a time" — the orb stays but recedes while findings animate).
 */
export function Orb({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <div
      className={['orb', dimmed ? 'orb--dimmed' : ''].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}
