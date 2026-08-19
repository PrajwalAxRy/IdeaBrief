export function Divider({ className = '' }: { className?: string }) {
  return <hr className={['divider', className].filter(Boolean).join(' ')} />;
}
