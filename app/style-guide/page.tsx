import { SectionIndex } from '@/components/layout/section-index';
import { ChromeSection } from '@/components/style-guide/sections/chrome';
import { EvidenceSection } from '@/components/style-guide/sections/evidence';
import { FiguresSection } from '@/components/style-guide/sections/figures';
import { FoundationsSection } from '@/components/style-guide/sections/foundations';
import { LayoutSection } from '@/components/style-guide/sections/layout';
import { StatesSection } from '@/components/style-guide/sections/states';
import { UiAtomsSection } from '@/components/style-guide/sections/ui-atoms';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { EvidenceProvider } from '@/components/validate/evidence/evidence-context';
import {
  getDiscarded,
  getEvidence,
  getReport,
  getRoadmap,
  getRun,
  getRunSummary,
} from '@/lib/db/queries';

/* The root layout's `title.template` is `%s — Groundwork`, so this renders as
   `Style Guide — Groundwork`. Writing the suffix here too would double it. */
export const metadata = {
  title: 'Style Guide',
};

/**
 * **`define`, `roadmap` and `validate` were deleted in A14.** They were
 * page-composition galleries — a second copy of a page, assembled by hand — and
 * the four real routes now *are* that gallery. A duplicate page rots exactly
 * the way `entry.tsx` did: it drifts from the thing it depicts, and the drift
 * is invisible because nobody reads a style guide to check a page.
 *
 * What replaced them are the three sections that have no route of their own:
 * `evidence` (a layer, not a page), `chrome` (persistent, so never seen in
 * isolation) and `states` (loading and error, which are almost impossible to
 * look at in situ because the fixtures resolve synchronously).
 */
const NAV_ITEMS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'ui-atoms', label: 'UI Atoms' },
  { id: 'layout', label: 'Layout' },
  { id: 'figures', label: 'Figures' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'states', label: 'States' },
];

const SLUG = 'sms-rebooking-4f2a';

/**
 * Data comes through `lib/db/queries.ts` like every other page — the prototype
 * contract holds here too, and no section component imports from
 * `lib/fixtures/` directly.
 */
export default async function StyleGuidePage() {
  const [run, evidence, discarded, report, roadmap, summary] = await Promise.all([
    getRun(SLUG),
    getEvidence(SLUG),
    getDiscarded(SLUG),
    getReport(SLUG),
    getRoadmap(SLUG),
    getRunSummary(SLUG),
  ]);

  return (
    <EvidenceProvider evidence={evidence} discarded={discarded}>
      <main id="main" className="ob-container-app flex flex-col gap-24 py-16">
        <DisplayHeadline muted="Every design decision," bright="one page." level="display" />
        <SectionIndex items={NAV_ITEMS} />

        <FoundationsSection />
        <UiAtomsSection />
        <LayoutSection />
        <FiguresSection evidence={evidence} report={report} roadmap={roadmap} summary={summary} />
        <EvidenceSection evidence={evidence} discarded={discarded} />
        <ChromeSection run={run} summary={summary} />
        <StatesSection slug={SLUG} />
      </main>
    </EvidenceProvider>
  );
}
