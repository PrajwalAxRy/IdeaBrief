import {
  buildCitationIndex,
  citationNumberForFindingId,
  extractCitationNumbers,
  findingForCitation,
} from '@/lib/citations';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { reportFixture } from '@/lib/fixtures/report';
import { describe, expect, it } from 'vitest';

describe('citation numbering — global and stable', () => {
  it('derives the citation number from the finding id', () => {
    expect(citationNumberForFindingId('EV_01')).toBe(1);
    expect(citationNumberForFindingId('EV_12')).toBe(12);
    expect(citationNumberForFindingId('EV_47')).toBe(47);
  });

  it('throws on a malformed id rather than silently returning garbage', () => {
    expect(() => citationNumberForFindingId('not-an-id')).toThrow();
  });

  it('resolves the same finding for the same citation number every time', () => {
    const first = findingForCitation(evidenceFixture, 12);
    const second = findingForCitation(evidenceFixture, 12);
    expect(first).toBeDefined();
    expect(first).toBe(second);
    expect(first?.id).toBe('EV_12');
  });

  it('builds a lookup index covering every finding exactly once', () => {
    const index = buildCitationIndex(evidenceFixture);
    expect(index.size).toBe(evidenceFixture.length);
    for (const finding of evidenceFixture) {
      expect(index.get(citationNumberForFindingId(finding.id))).toBe(finding);
    }
  });

  it('extracts every [n] reference from prose, in order', () => {
    expect(extractCitationNumbers('Cites [2] then [12] then [2] again.')).toEqual([2, 12, 2]);
    expect(extractCitationNumbers('No citations here.')).toEqual([]);
  });

  it('every citation in the report summary resolves to a real finding', () => {
    for (const citation of reportFixture.summary.citations) {
      expect(findingForCitation(evidenceFixture, citation)).toBeDefined();
    }
  });

  it('every citation in every dimension prose resolves to a real finding', () => {
    for (const section of Object.values(reportFixture.dimensions)) {
      for (const citation of section.prose.citations) {
        expect(findingForCitation(evidenceFixture, citation)).toBeDefined();
      }
    }
  });
});
