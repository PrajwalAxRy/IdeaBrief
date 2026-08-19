import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { Divider } from '@/components/ui/divider';
import { EmptyNote } from '@/components/ui/empty-note';
import { FilterPill } from '@/components/ui/filter-pill';
import { IconButton } from '@/components/ui/icon-button';
import { MetaLine } from '@/components/ui/meta-line';
import { Popover } from '@/components/ui/popover';
import { Prose } from '@/components/ui/prose';
import { RestIndicator } from '@/components/ui/rest-indicator';
import { SectionLabel } from '@/components/ui/section-label';
import { FieldSkeleton, Skeleton, SkeletonText } from '@/components/ui/skeleton';
import { Spinner } from '@/components/ui/spinner';
import { TextArea } from '@/components/ui/text-area';
import { Tooltip } from '@/components/ui/tooltip';
import { Well } from '@/components/ui/well';
import { ExternalLink, HelpCircle } from 'lucide-react';
import {
  CopyButtonDemo,
  DrawerDemo,
  InlineEditableFieldDemo,
  InlineEditableListDemo,
  ModalDemo,
} from './kitchen-sink-client';

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>{title}</SectionLabel>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export default function KitchenSinkPage() {
  return (
    <main className="mx-auto flex max-w-app flex-col gap-16 px-8 py-16">
      <DisplayHeadline muted="Every primitive," bright="proven." />

      <Row title="Button">
        <Button variant="primary">Start the run</Button>
        <Button variant="secondary">Edit</Button>
        <Button variant="primary" size="sm">
          Approve
        </Button>
        <Button variant="secondary" size="sm">
          Cancel
        </Button>
        <Button variant="primary" disabled>
          Disabled
        </Button>
      </Row>

      <Row title="IconButton + Tooltip">
        <Tooltip label="Close">
          <IconButton label="Close">
            <ExternalLink size={18} />
          </IconButton>
        </Tooltip>
        <IconButton label="Disabled action" disabled>
          <ExternalLink size={18} />
        </IconButton>
      </Row>

      <Row title="TextAction">
        <button type="button" className="text-action">
          show excerpt
        </button>
        <button type="button" className="text-action" disabled>
          collapse
        </button>
      </Row>

      <Row title="CopyButton">
        <CopyButtonDemo />
      </Row>

      <Row title="TextArea">
        <TextArea placeholder="Type your idea…" minRows={3} className="max-w-conversation" />
      </Row>
      <Row title="TextArea — hero (The Box)">
        <TextArea variant="hero" placeholder="A half-formed idea is enough." className="w-full" />
      </Row>

      <Row title="InlineEditableField">
        <InlineEditableFieldDemo />
      </Row>
      <Row title="InlineEditableList">
        <InlineEditableListDemo />
      </Row>

      <Row title="FilterPill">
        <FilterPill defaultActive>Problem</FilterPill>
        <FilterPill>What exists</FilterPill>
        <FilterPill>Demand signals</FilterPill>
        <FilterPill>Money</FilterPill>
        <FilterPill>Practical</FilterPill>
      </Row>

      <Row title="Card">
        <Card className="w-64">
          <p style={{ color: 'var(--text-body)' }}>Default card.</p>
        </Card>
        <Card interactive className="w-64">
          <p style={{ color: 'var(--text-body)' }}>Interactive — hover to lift.</p>
        </Card>
        <Card featured className="w-64">
          <p style={{ color: 'var(--text-body)' }}>Featured — amber ring.</p>
        </Card>
      </Row>

      <Row title="Well (inside a Card)">
        <Card className="w-96">
          <p style={{ color: 'var(--text-body)', marginBottom: 'var(--sp-3)' }}>
            The excerpt below sits in a recessed Well — never a nested card.
          </p>
          <Well>
            <p className="meta-line">{'EXAMPLE.COM // PUBLISHED 2026-02-14'}</p>
            <p style={{ color: 'var(--text-body)', marginTop: 'var(--sp-2)' }}>
              &ldquo;92% of dental no-shows are same-week cancellations.&rdquo;
            </p>
          </Well>
        </Card>
      </Row>

      <Row title="Drawer">
        <DrawerDemo />
      </Row>

      <Row title="Modal">
        <ModalDemo />
      </Row>

      <Row title="Popover (citation-style peek)">
        <Popover
          trigger={
            <button type="button" className="text-action">
              [12]
            </button>
          }
        >
          <p className="meta-line" style={{ marginBottom: 'var(--sp-2)' }}>
            {'EV_12 // VERIFIED 2026-08-19 14:22'}
          </p>
          <p>&ldquo;92% of dental no-shows are same-week cancellations.&rdquo;</p>
        </Popover>
      </Row>

      <Row title="Accordion (independent state, never auto-collapses siblings)">
        <div className="w-full max-w-prose">
          <Accordion title="What we found" defaultOpen>
            <p style={{ color: 'var(--text-body)' }}>
              12 findings support this claim. Expanding one accordion never closes another.
            </p>
          </Accordion>
          <Accordion title="Who else is doing this">
            <p style={{ color: 'var(--text-body)' }}>3 competitors identified.</p>
          </Accordion>
        </div>
      </Row>

      <Row title="Divider">
        <div className="w-full">
          <Divider />
        </div>
      </Row>

      <Row title="SectionLabel">
        <SectionLabel>What you get</SectionLabel>
      </Row>

      <Row title="DisplayHeadline">
        <DisplayHeadline muted="An idea in." bright="Clarity out." breakBetween />
      </Row>

      <Row title="MetaLine">
        <MetaLine
          parts={['RUN 7f3a91c4', '19 QUERIES', '31 PAGES FETCHED', '47 VERIFIED', '18 DISCARDED']}
        />
      </Row>

      <Row title="Prose">
        <Prose className="w-full">
          <p>
            A person arrives with a half-formed idea. What survives verification becomes a report
            [12]. This paragraph demonstrates the 68ch measure and relaxed leading.
          </p>
          <p>A second paragraph proves the vertical rhythm between prose blocks.</p>
        </Prose>
      </Row>

      <Row title="Skeleton / SkeletonText / FieldSkeleton">
        <Skeleton width={120} height={16} />
        <SkeletonText lines={3} className="max-w-64" />
        <FieldSkeleton label="customer" />
      </Row>

      <Row title="EmptyNote">
        <EmptyNote>No runs yet — start one above.</EmptyNote>
        <EmptyNote
          action={
            <button type="button" className="text-action">
              <HelpCircle size={14} />
              Learn why
            </button>
          }
        >
          Nothing discarded in this run.
        </EmptyNote>
      </Row>

      <Row title="Spinner">
        <Spinner />
        <Button variant="primary" size="sm">
          <Spinner size={14} />
          Starting research…
        </Button>
      </Row>

      <Row title="RestIndicator">
        <RestIndicator />
      </Row>
    </main>
  );
}
