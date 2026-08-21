import { EvidenceButton } from '@/components/layout/evidence-button';
import { StageRail } from '@/components/layout/stage-rail';
import { Wordmark } from '@/components/layout/wordmark';
import { Row, Section } from '@/components/style-guide/section';
import { MetaLine } from '@/components/ui/meta-line';
import type { RunSummary } from '@/lib/run-summary';
import type { Run } from '@/lib/schemas/run';

/**
 * The run chrome, out of its shell.
 *
 * `RunHeader` itself is not reproduced here: it is `position: fixed` with a
 * constant-height spacer holding its place, so a second one on this page would
 * either overlay the real chrome or need its positioning disabled — and a
 * specimen with its defining property switched off proves nothing. Its parts
 * are shown instead, and the header proper is reviewed on the four run routes,
 * expanded and condensed, where it actually behaves.
 *
 * **`StageRail` in all three states.** Locked carries no affordance at all —
 * dim text, a hollow node, no hover rule, no `aria-disabled`, never a disabled
 * link. The three `status` values below produce the three states without any
 * prop that exists only for this gallery.
 */
export function ChromeSection({ run, summary }: { run: Run; summary: RunSummary }) {
  return (
    <Section
      id="chrome"
      title="Chrome"
      note="Blue appears exactly twice in the chrome: the active stage's rule (live/active) and the evidence button's square (verification). A third blue thing here means one of them is wrong."
    >
      <Row title="Wordmark">
        <Wordmark />
        <Wordmark size="sm" />
      </Row>

      <Row title="Stage rail — mid-run (Validate active, Roadmap locked)">
        <StageRail slug={run.slug} status="validating" segment="validate" />
      </Row>

      <Row title="Stage rail — complete, on Roadmap">
        <StageRail slug={run.slug} status="complete" segment="roadmap" />
      </Row>

      <Row title="Stage rail — on Sources (no stage is active)">
        <StageRail slug={run.slug} status="complete" segment="sources" />
      </Row>

      <Row title="Evidence button">
        <EvidenceButton
          verifiedCount={summary.verified_count}
          discardedCount={summary.discarded_count}
        />
      </Row>

      <Row title="Meta line — the run ledger">
        <MetaLine
          parts={[
            `RUN ${run.slug}`,
            `${summary.verified_count} VERIFIED`,
            `${summary.discarded_count} DISCARDED`,
          ]}
        />
      </Row>
    </Section>
  );
}
