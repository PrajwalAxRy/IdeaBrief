import { APP_BRAND, DEFINE, REPORT, ROADMAP, SOURCES } from '@/lib/content/app';
import { getBrief, getRoadmap, getRunSummary } from '@/lib/db/queries';
import { isOnAxis, planHorizon } from '@/lib/run-plan';

export const metadata = {
  title: 'OG cards',
  robots: { index: false, follow: false },
};

const SLUG = 'sms-rebooking-4f2a';

/**
 * The five Open Graph frames, **drawn in code** and screenshotted into
 * `public/og/*.png` with the Playwright MCP at `scale: "css"`.
 *
 * Sharing a run is the product's entire distribution model, and every shared
 * link previewed as bare text (R18). The images are committed as static PNGs
 * rather than generated per-request: an `og:image` pointing at a 404 is worse
 * than no tag, and this prototype has no route handlers by contract (rule 13 is
 * satisfied because a product surface is drawn in code, not screenshotted).
 *
 * **Exactly one blue element per card** — the `●` before `VERIFIED`, which is
 * blue doing job two: verification. Nothing else on a card is accent.
 *
 * Every number is derived. Typing `47` here would let a shared card drift from
 * the page it advertises, which is the one artefact that travels furthest.
 */
function Card({
  name,
  eyebrow,
  headline,
  meta,
}: {
  name: string;
  eyebrow: string;
  headline: string;
  meta: string[];
}) {
  return (
    <div
      data-og={name}
      style={{
        width: 1200,
        height: 630,
        background: 'var(--ob-void)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 96,
      }}
    >
      {/* The one hairline frame, inset 48px. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 48,
          border: '1px solid var(--ob-hairline)',
          pointerEvents: 'none',
        }}
      />

      {/* The wordmark top-left, in mono, with the surface it points at. A card
          has to say what product it is before it says which page. */}
      <p
        className="ob-meta"
        style={{ position: 'relative', display: 'flex', gap: 10, color: 'var(--ob-muted)' }}
      >
        <span style={{ color: 'var(--ob-text)' }}>{APP_BRAND.name.toUpperCase()}</span>
        {eyebrow ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{eyebrow}</span>
          </>
        ) : null}
      </p>

      <p
        style={{
          position: 'relative',
          fontSize: 72,
          fontWeight: 'var(--ob-weight)',
          letterSpacing: '-0.035em',
          lineHeight: 1.04,
          color: 'var(--ob-text)',
          maxWidth: '18ch',
          margin: 0,
        }}
      >
        {headline}
      </p>

      <p
        className="ob-meta"
        style={{ position: 'relative', display: 'flex', gap: 10, color: 'var(--ob-dim)' }}
      >
        {meta.map((part, i) => (
          <span key={part} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {i > 0 ? <span aria-hidden="true">·</span> : null}
            {/* The single accent mark on the whole card. */}
            {part.includes('VERIFIED') ? (
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  background: 'var(--ob-accent)',
                  display: 'inline-block',
                }}
              />
            ) : null}
            {part}
          </span>
        ))}
      </p>
    </div>
  );
}

export default async function OgCardsPage() {
  const [summary, roadmap, brief] = await Promise.all([
    getRunSummary(SLUG),
    getRoadmap(SLUG),
    getBrief(SLUG),
  ]);

  const buildSteps = roadmap.steps.filter(isOnAxis).length;
  const tripwires = roadmap.steps.length - buildSteps;
  const weeks = planHorizon(roadmap);
  const answered = Object.values(brief).filter(
    (field) => typeof field === 'object' && field !== null && 'status' in field,
  ).length;

  const cards = [
    {
      name: 'default',
      eyebrow: '',
      headline: 'From a hunch to something you can defend.',
      meta: ['NO SCORE', 'NO VERDICT', 'NO LOGIN'],
    },
    {
      name: 'define',
      eyebrow: 'DEFINE',
      headline: DEFINE.title,
      meta: [`${answered} FIELDS`, 'WRITTEN WITH YOU', 'NOT A FORM'],
    },
    {
      name: 'validate',
      eyebrow: 'VALIDATE',
      headline: REPORT.h1,
      meta: [
        `${summary.verified_count} VERIFIED`,
        `${summary.pages_fetched} SOURCES`,
        `${summary.discarded_count} DISCARDED`,
        'NO SCORE',
      ],
    },
    {
      name: 'roadmap',
      eyebrow: 'ROADMAP',
      headline: ROADMAP.h1,
      meta: [
        `${roadmap.open_questions.length} OPEN QUESTIONS`,
        `${buildSteps} BUILD STEPS`,
        `${tripwires} TRIPWIRE`,
        `${weeks} WEEKS`,
      ],
    },
    {
      name: 'sources',
      eyebrow: 'SOURCES',
      headline: SOURCES.h1,
      meta: [
        `${summary.verified_count} VERIFIED`,
        `${summary.discarded_count} DISCARDED`,
        'EVERY ONE KEPT',
      ],
    },
  ];

  return (
    <main id="main" style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 40 }}>
      {cards.map((card) => (
        <Card key={card.name} {...card} />
      ))}
    </main>
  );
}
