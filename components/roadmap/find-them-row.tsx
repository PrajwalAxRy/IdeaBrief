'use client';

import { CitationChip } from '@/components/validate/evidence/citation-chip';
import { useEvidence } from '@/components/validate/evidence/evidence-context';
import { ROADMAP } from '@/lib/content/app';
import type { FindThemItem } from '@/lib/schemas/roadmap';

/**
 * `FIND THEM`, and its link branch stops being dead code.
 *
 * **It branches on the `type` discriminator, not on which optional field
 * happens to be present.** The shipped version checked `item.url` first, and
 * because zero `url` fields exist in the fixture every `link` item fell through
 * to the citation branch and rendered as inert text — a `type` bug wearing a
 * styling bug's clothes, which is why this is a real file.
 *
 * **The href is derived from the cited finding, never authored.** That is why
 * `FindThemItemSchema` has no `url` and why none should be added: an authored
 * URL beside a citation is two sources for one fact.
 *
 * It reads the `EvidenceProvider` already mounted in the run layout — no new
 * plumbing and no prop threaded down the page.
 */
export function FindThemRow({ items }: { items: FindThemItem[] }) {
  const { findFinding } = useEvidence();

  /* Never a fabricated list. */
  if (items.length === 0) return <p className="ob-oq-note">{ROADMAP.noCommunities}</p>;

  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        const finding = item.citation_id === undefined ? undefined : findFinding(item.citation_id);

        if (item.type === 'link' && finding) {
          return (
            <li key={item.label}>
              <a
                className="ob-finding-source-link"
                href={finding.source_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}{' '}
                <span className="ob-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>{' '}
              <CitationChip n={item.citation_id as number} />
            </li>
          );
        }

        /* A count asserts a quantity, so it reads at full strength. */
        if (item.type === 'count') {
          return (
            <li key={item.label} className="ob-oq-count">
              {item.label}
              {item.citation_id !== undefined ? (
                <>
                  {' '}
                  <CitationChip n={item.citation_id} />
                </>
              ) : null}
            </li>
          );
        }

        return (
          <li key={item.label} className="ob-oq-note">
            {item.label}
          </li>
        );
      })}
    </ul>
  );
}
