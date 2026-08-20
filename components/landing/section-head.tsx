import { ScrollReveal } from './scroll-reveal';
import { WordReveal } from './word-reveal';

type Props = {
  index: string;
  eyebrow: string;
  headlineLines: readonly string[];
  lead?: string;
  id?: string;
  className?: string;
};

/**
 * The opener every section below the hero shares: a mono index and label with
 * a hairline running off to the right, then the headline revealing word by
 * word, then an optional lead.
 */
export function SectionHead({ index, eyebrow, headlineLines, lead, id, className }: Props) {
  return (
    <div className={className}>
      <ScrollReveal>
        {/* Index in chalk, not accent: blue is reserved for action,
            verification, and live state. A static label is none of those. */}
        <p className="ob-eyebrow ob-meta">
          <span className="ob-em">{index}</span>
          <span>{eyebrow}</span>
        </p>
      </ScrollReveal>

      <WordReveal
        as="h2"
        id={id}
        className="ob-h1 mt-8 max-w-[20ch]"
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
