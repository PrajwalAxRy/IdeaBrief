import { getRun } from '@/lib/db/queries';
import { resolveRunRedirect } from '@/lib/run-stage';
import { redirect } from 'next/navigation';

/** Resolves the canonical `/r/[slug]` URL to the furthest meaningful stage. */
export default async function RunIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const run = await getRun(slug);
  redirect(`/r/${slug}${resolveRunRedirect(run.status)}`);
}
