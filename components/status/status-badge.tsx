/** Footer system status: green dot + `[ALL SYSTEMS OPERATIONAL]`. */
export function StatusBadge({ className = '' }: { className?: string }) {
  return (
    <span className={['status-badge', className].filter(Boolean).join(' ')}>
      <span className="status-badge-dot" aria-hidden="true" />
      [ALL SYSTEMS OPERATIONAL]
    </span>
  );
}
