'use client';

import { Row, Section } from '@/components/style-guide/section';
import { CitationChip } from '@/components/validate/evidence/citation-chip';
import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { FindingCard } from '@/components/validate/evidence/finding-card';
import { DiscardRow } from '@/components/validate/explorer/discard-row';
import { EvidenceRow } from '@/components/validate/explorer/evidence-row';
import { citationNumberForFindingId } from '@/lib/citations';
import type { Discarded, Evidence } from '@/lib/schemas/evidence';

/**
 * The evidence layer, end to end.
 *
 * **All three `FindingCard` variants survive** (C13) — `stream` is the
 * console's, `accordion` is the report's, `row` is the one the explorer
 * replaced with `EvidenceRow` for its own list but which the drawer's related
 * findings still use. None was deleted, so all three are shown here.
 *
 * Every chip on this page opens the real drawer against the real provider, so
 * this section is also where the drawer itself is reviewed — there is no
 * separate specimen, because a drawer with fake contents proves nothing.
 */
export function EvidenceSection({
  evidence,
  discarded,
}: { evidence: Evidence; discarded: Discarded }) {
  const { openById } = useEvidence();
  const [first, second, third] = evidence;
  const [firstDiscard] = discarded;

  return (
    <Section
      id="evidence"
      title="Evidence"
      note="Three layers of disclosure: the chip, its hover popover, and the drawer. Every number is derived from the finding's id (EV_12 → 12), never from array position, so it cannot drift when the evidence is re-sorted or filtered."
    >
      <Row title="Citation chip">
        <CitationChip n={citationNumberForFindingId(first.id)} />
        <CitationChip n={citationNumberForFindingId(second.id)} />
        <CitationChip n={citationNumberForFindingId(third.id)} />
      </Row>

      <Row title="Finding card — stream">
        <div className="w-full max-w-[560px]">
          <FindingCard finding={first} variant="stream" state="verified" />
        </div>
      </Row>

      <Row title="Finding card — stream, pending">
        <div className="w-full max-w-[560px]">
          <FindingCard finding={second} variant="stream" state="pending" />
        </div>
      </Row>

      <Row title="Finding card — accordion">
        <div className="w-full max-w-[580px]">
          <FindingCard
            finding={second}
            variant="accordion"
            citationNumber={citationNumberForFindingId(second.id)}
            onOpenEvidence={() => openById(second.id)}
          />
        </div>
      </Row>

      <Row title="Finding card — row">
        <div className="w-full max-w-[720px]">
          <FindingCard
            finding={third}
            variant="row"
            citationNumber={citationNumberForFindingId(third.id)}
            citedInReport
            onOpenEvidence={() => openById(third.id)}
          />
        </div>
      </Row>

      <Row title="Evidence row — the explorer's list row">
        <div className="ob-explorer w-full">
          <div className="ob-src-list">
            <EvidenceRow
              finding={first}
              citationNumber={citationNumberForFindingId(first.id)}
              cited
              index={0}
              onOpen={() => openById(first.id)}
            />
            <EvidenceRow
              finding={second}
              citationNumber={citationNumberForFindingId(second.id)}
              cited={false}
              index={1}
              onOpen={() => openById(second.id)}
            />
          </div>
        </div>
      </Row>

      <Row title="Discard row">
        <div className="ob-explorer w-full">
          <div className="ob-src-list">
            <DiscardRow record={firstDiscard} index={0} onOpen={() => openById(firstDiscard.id)} />
          </div>
        </div>
      </Row>
    </Section>
  );
}
