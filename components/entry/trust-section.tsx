import { VerifiedBadge } from '@/components/status/verified-badge';
import { Card } from '@/components/ui/card';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { MetaLine } from '@/components/ui/meta-line';
import { Reveal } from '@/components/ui/reveal';
import { SectionLabel } from '@/components/ui/section-label';
import { Well } from '@/components/ui/well';

/**
 * One wide card containing a realistic verified-excerpt specimen — the
 * highest-value section for a sceptical visitor, since it shows the
 * mechanism instead of describing it.
 */
export function TrustSection() {
  return (
    <section className="py-24">
      <SectionLabel>How it's different</SectionLabel>
      <DisplayHeadline
        bright="Every quote is checked"
        muted="against the page it came from."
        reverse
        as="h2"
        className="pb-8"
      />

      <Reveal>
        <Card padding="feature" className="flex flex-col gap-6">
          <Well className="flex items-center justify-between gap-6">
            <p style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>
              "Plans start at $299 per month per location…"
            </p>
            <div className="flex items-center gap-4">
              <span className="meta-line">example.com/pricing</span>
              <VerifiedBadge />
            </div>
          </Well>

          <p style={{ color: 'var(--text-body)' }}>
            If the words aren't on the page, they don't reach you.
          </p>

          <MetaLine parts={['47 VERIFIED', '18 DISCARDED', 'typical run']} />
        </Card>
      </Reveal>
    </section>
  );
}
