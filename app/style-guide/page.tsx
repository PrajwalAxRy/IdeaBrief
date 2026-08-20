import { SectionIndex } from '@/components/layout/section-index';
import { DefineSection } from '@/components/style-guide/sections/define';
import { EntrySection } from '@/components/style-guide/sections/entry';
import { FoundationsSection } from '@/components/style-guide/sections/foundations';
import { LayoutSection } from '@/components/style-guide/sections/layout';
import { RoadmapSection } from '@/components/style-guide/sections/roadmap';
import { UiAtomsSection } from '@/components/style-guide/sections/ui-atoms';
import { ValidateSection } from '@/components/style-guide/sections/validate';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { EvidenceProvider } from '@/components/validate/evidence/evidence-context';
import { evidenceFixture } from '@/lib/fixtures/evidence';

export const metadata = {
  title: 'Style Guide — IdeaBrief',
};

const NAV_ITEMS = [
  { id: 'foundations', label: 'Foundations' },
  { id: 'ui-atoms', label: 'UI Atoms' },
  { id: 'layout', label: 'Layout' },
  { id: 'entry', label: 'Entry' },
  { id: 'define', label: 'Define' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'validate', label: 'Validate' },
];

export default function StyleGuidePage() {
  return (
    <EvidenceProvider evidence={evidenceFixture}>
      <main className="mx-auto flex max-w-app flex-col gap-24 px-8 py-16">
        <DisplayHeadline muted="Every design decision," bright="one page." />
        <SectionIndex items={NAV_ITEMS} />

        <FoundationsSection />
        <UiAtomsSection />
        <LayoutSection />
        <EntrySection />
        <DefineSection />
        <RoadmapSection />
        <ValidateSection />
      </main>
    </EvidenceProvider>
  );
}
