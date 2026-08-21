/**
 * System status. Brackets dropped; the dot is `.ob-dot`, accent and pulsing —
 * legal as live state.
 *
 * **Currently zero call sites.** Its only one, `FooterPanel`, was deleted in
 * A2; the component is kept because A14 decides whether `RunFooterBar` carries
 * it. If A14 says no, A15's sweep deletes it.
 */
export function StatusBadge({ className = '' }: { className?: string }) {
  return (
    <span className={['ob-status ob-meta', className].filter(Boolean).join(' ')}>
      <span className="ob-dot" aria-hidden="true" />
      ALL SYSTEMS OPERATIONAL
    </span>
  );
}
