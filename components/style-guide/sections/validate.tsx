import { Report } from '@/components/validate/report/report';
import { SourcesList } from '@/components/validate/sources-list';
import { evidenceFixture } from '@/lib/fixtures/evidence';
import { reportFixture } from '@/lib/fixtures/report';
import { runFixture } from '@/lib/fixtures/run';
import { Row, Section } from '../section';

const SOURCE_COUNT = new Set(evidenceFixture.map((finding) => finding.source_url)).size;

export function ValidateSection() {
  return (
    <Section
      id="validate"
      title="Validate"
      note="components/validate/* — evidence is provided by a single EvidenceProvider wrapping the whole page (see app/style-guide/page.tsx), so citation chips clicked anywhere here open the same drawer. RunConsole/ValidateView are excluded: their live findings stream depends on an active run's API route, which this static reference page doesn't set up."
    >
      <Row title="Report (full composed report page)">
        <div className="w-full border" style={{ borderColor: 'var(--border-subtle)' }}>
          <Report
            slug={runFixture.slug}
            oneLiner={runFixture.idea_text}
            report={reportFixture}
            researchedDate="2026-08-19"
            verifiedCount={evidenceFixture.length}
            sourceCount={SOURCE_COUNT}
            isThin={false}
          />
        </div>
      </Row>

      <Row title="SourcesList">
        <div className="w-full max-w-prose">
          <SourcesList evidence={evidenceFixture} />
        </div>
      </Row>
    </Section>
  );
}
