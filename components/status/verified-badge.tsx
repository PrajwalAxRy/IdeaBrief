/** `● VERIFIED` — the trust marker. Appears on every finding, everywhere. */
export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span className={['verified-badge', className].filter(Boolean).join(' ')}>
      <span className="verified-badge-dot" aria-hidden="true" />
      VERIFIED
    </span>
  );
}
