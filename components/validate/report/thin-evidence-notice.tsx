import { Card } from '@/components/ui/card';
import Link from 'next/link';

/**
 * The honest panel for low-yield runs. Diagnostic, never apologetic, never
 * encouraging — one acknowledgement, then get on with it (07).
 */
export function ThinEvidenceNotice({ slug }: { slug: string }) {
  return (
    <Card featured padding="feature" className="flex flex-col gap-4">
      <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-h3)' }}>
        We found very little about this online.
      </p>
      <p style={{ color: 'var(--text-body)' }}>
        That is not evidence against your idea — it usually means the idea is new, very local, or
        described in words the web doesn&rsquo;t use yet. The most useful part of this run is the
        next section.
      </p>
      <Link href={`/r/${slug}/roadmap`} className="btn btn-primary self-start">
        What to do next →
      </Link>
    </Card>
  );
}
