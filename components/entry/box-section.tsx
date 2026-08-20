import { DisplayHeadline } from '@/components/ui/display-headline';
import { SectionLabel } from '@/components/ui/section-label';
import { TheBox } from './the-box';

/**
 * The input band. Per deep-canopy-design's section-pattern table this one takes
 * no media slot — the textarea *is* the focal object, so it carries the bloom
 * (`.textarea--hero`) and everything else in the section stays quiet.
 */
export function BoxSection() {
  return (
    <section id="the-box" className="flex flex-col items-center py-32 text-center">
      <SectionLabel>Start here</SectionLabel>
      <DisplayHeadline as="h2" muted="Say it badly." bright="That's the point." className="pb-6" />
      <p className="lead max-w-conversation pb-12">
        You don't need a pitch. A half-formed sentence is enough to start — the next screen asks the
        questions.
      </p>

      <TheBox />
    </section>
  );
}
