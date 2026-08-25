import { ScrollReveal } from './scroll-reveal';
import { WordReveal } from './word-reveal';

type Props = {
  /** Omit both of these to render a headline with no overline above it. */
  index?: string;
  eyebrow?: string;
  headlineLines: readonly string[];
  lead?: string;
  id?: string;
  className?: string;
};

/**
 * The opener every section below the hero shares: an optional mono index and
 * label with a hairline running off to the right, then the headline revealing
 * word by word, then an optional lead.
 *
 * **The overline is optional as of the entry-point rework.** `/` stopped
 * counting its sections: `CofounderChat` dropped `01 START HERE` along with its
 * whole head, which left `Pillars` carrying a lone `02` above the only numbered
 * section on the page — a list that starts at two and never continues. Both are
 * gone, and the numerals are absent rather than renumbered.
 *
 * `index` without `eyebrow` (or the reverse) renders whichever was passed. The
 * pair is not enforced in types because the only caller passes neither, and a
 * required-together constraint costs a union for no live consumer.
 */
export function SectionHead({ index, eyebrow, headlineLines, lead, id, className }: Props) {
  /* `mt-8` on the headline is conditional on the overline existing — with no
     overline above it, that margin is a gap under nothing, and in `Pillars`'
     sticky column it pushed the whole pinned block off its intended eyeline. */
  const hasOverline = Boolean(index || eyebrow);

  return (
    <div className={className}>
      {hasOverline ? (
        <ScrollReveal>
          {/* Index in chalk, not accent: blue is reserved for action,
              verification, and live state. A static label is none of those. */}
          <p className="ob-eyebrow ob-meta">
            {index ? <span className="ob-em">{index}</span> : null}
            {eyebrow ? <span>{eyebrow}</span> : null}
          </p>
        </ScrollReveal>
      ) : null}

      <WordReveal
        as="h2"
        id={id}
        className={`ob-h1 max-w-[20ch] ${hasOverline ? 'mt-8' : ''}`}
        lines={headlineLines}
        stagger={48}
      />

      {lead ? (
        <ScrollReveal delay={200}>
          <p className="ob-lead mt-8 max-w-[54ch]">{lead}</p>
        </ScrollReveal>
      ) : null}
    </div>
  );
}
