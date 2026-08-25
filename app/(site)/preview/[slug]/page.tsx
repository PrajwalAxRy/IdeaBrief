import { PREVIEW_RUNS } from '@/lib/content/landing';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

/**
 * A finished-run preview — under construction.
 *
 * **The route exists so the three cards on `/` have somewhere real to land.**
 * The runs themselves are not built: this renders the idea it was asked for and
 * says plainly that the page is not finished, rather than showing a fake report.
 * `executive_summary.md` binds the product to never inventing content to fill a
 * field, and a placeholder brief with plausible-looking findings would be
 * exactly that.
 *
 * An unknown slug is a **404, not a generic placeholder**. A page that renders
 * "under construction" for every string anyone types would hide a broken link
 * from us for as long as the real pages take to arrive.
 *
 * Server Component, statically generated — `PREVIEW_RUNS` is site content in
 * `lib/content/landing.ts`, not run data, so it does not go through the
 * `lib/db/queries.ts` seam.
 */

export function generateStaticParams() {
  return PREVIEW_RUNS.map((run) => ({ slug: run.slug }));
}

/* Next 16: `params` is a Promise and must be awaited — see
   node_modules/next/dist/docs. Destructuring it directly is the v14 shape. */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const run = PREVIEW_RUNS.find((r) => r.slug === slug);
  /* Bare titles: the root layout sets `template: '%s — Groundwork'`, so adding
     the suffix here renders it twice. */
  if (!run) return { title: 'Not found' };
  return { title: run.title, description: run.finding };
}

export default async function PreviewRunPage({ params }: Props) {
  const { slug } = await params;
  const run = PREVIEW_RUNS.find((r) => r.slug === slug);
  if (!run) notFound();

  return (
    <div className="ob-container ob-underconstruction">
      <p className="ob-meta">{run.sector}</p>

      <h1 className="ob-h1 mt-6 max-w-[22ch]">{run.title}</h1>

      <p className="ob-lead mt-8 max-w-[54ch]">{run.finding}</p>

      <hr className="ob-rule mt-16" />

      <p className="ob-meta mt-16">Under construction</p>
      <p className="ob-body mt-4 max-w-[54ch]">
        This run’s report isn’t published yet. Nothing is shown here rather than showing a report
        that hasn’t been researched — the same rule the product runs on everywhere else.
      </p>

      <div className="mt-10 flex items-center gap-6">
        <Link href="/#start" className="ob-btn ob-btn-ghost">
          Start your own run
        </Link>
        <Link href="/" className="ob-btn ob-btn-bare">
          Back to the home page
        </Link>
      </div>
    </div>
  );
}
