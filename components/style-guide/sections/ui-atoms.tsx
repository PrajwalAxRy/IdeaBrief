'use client';

import { StatusBadge } from '@/components/status/status-badge';
import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/copy-button';
import { Divider } from '@/components/ui/divider';
import { Drawer } from '@/components/ui/drawer';
import { EmptyNote } from '@/components/ui/empty-note';
import { FilterPill } from '@/components/ui/filter-pill';
import { IconButton } from '@/components/ui/icon-button';
import { InlineEditableField } from '@/components/ui/inline-editable-field';
import { InlineEditableList } from '@/components/ui/inline-editable-list';
import { MetaLine } from '@/components/ui/meta-line';
import { Modal } from '@/components/ui/modal';
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
import { useState } from 'react';
import { Row, Section } from '../section';

function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Open drawer
      </Button>
      <Drawer open={open} onOpenChange={setOpen} title="Evidence">
        <p className="ob-body">
          The 520px right-side drawer. Esc closes it; focus returns to the trigger on close.
        </p>
      </Drawer>
    </>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Discard and restart conversation?"
        description="This clears the conversation and the brief. Your original idea text is kept."
      >
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={() => setOpen(false)}>
            Discard
          </Button>
        </div>
      </Modal>
    </>
  );
}

function InlineEditableFieldDemo() {
  const [value, setValue] = useState('SMS rebooking for dental clinics');
  const [draft, setDraft] = useState(value);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <InlineEditableField
      label="one_liner"
      value={isEditing ? draft : value}
      isEditing={isEditing}
      onStartEdit={() => {
        setDraft(value);
        setIsEditing(true);
      }}
      onChange={setDraft}
      onCommit={() => {
        setValue(draft);
        setIsEditing(false);
      }}
      onCancel={() => setIsEditing(false)}
    />
  );
}

function InlineEditableListDemo() {
  const [items, setItems] = useState([
    'Clinics already use paper reminder cards',
    'No-shows cost roughly $200 per slot',
  ]);

  return (
    <InlineEditableList
      label="assumptions"
      items={items}
      onChangeItem={(index, value) =>
        setItems((current) => current.map((item, i) => (i === index ? value : item)))
      }
      onRemoveItem={(index) => setItems((current) => current.filter((_, i) => i !== index))}
      onAddItem={() => setItems((current) => [...current, ''])}
    />
  );
}

function CopyButtonDemo() {
  return (
    <div className="flex items-center gap-6">
      <CopyButton
        getText={() => 'https://startup-validator.app/r/sms-rebooking-4f2a'}
        label="Copy link"
      />
      <CopyButton
        getText={() => '1. How many clinics have you spoken to?\n2. What do they use today?'}
        label="Copy script"
        variant="button"
      />
    </div>
  );
}

export function UiAtomsSection() {
  return (
    <Section
      id="ui-atoms"
      title="UI Atoms"
      note="components/ui/* — every primitive except CopyLinkButton, which is an async Server Component and can't render outside Next (see the Layout section note)."
    >
      <Row title="Button">
        <Button variant="primary">Start the run</Button>
        <Button variant="ghost">Edit</Button>
        <Button variant="primary" size="sm">
          Approve
        </Button>
        <Button variant="ghost" size="sm">
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
        <button type="button" className="ob-text-action">
          show excerpt
        </button>
        <button type="button" className="ob-text-action" disabled>
          collapse
        </button>
      </Row>

      <Row title="CopyButton">
        <CopyButtonDemo />
      </Row>

      <Row title="TextArea — field">
        <TextArea placeholder="Type your idea…" minRows={3} className="max-w-[64ch]" />
      </Row>
      <Row title="TextArea — composer">
        <TextArea
          variant="composer"
          placeholder="A half-formed idea is enough."
          className="w-full"
        />
      </Row>

      <Row title="InlineEditableField">
        <InlineEditableFieldDemo />
      </Row>
      <Row title="InlineEditableList">
        <InlineEditableListDemo />
      </Row>

      <Row title="FilterPill — a chip at 4px, not a pill (rule 8); counts are mono">
        <FilterPill defaultActive count={14}>
          Problem
        </FilterPill>
        <FilterPill count={11}>Exists</FilterPill>
        <FilterPill count={7}>Demand</FilterPill>
        <FilterPill count={13}>Money</FilterPill>
        <FilterPill count={2}>Practical</FilterPill>
      </Row>

      <Row title="Card — elevation is a border and a surface step; no shadow">
        <Card className="w-64">
          <p className="ob-body">Default.</p>
        </Card>
        <Card interactive className="w-64">
          <p className="ob-body">Interactive — hover changes the hairline and the surface.</p>
        </Card>
        <Card verified className="w-64">
          <p className="ob-body">
            Verified — an accent hairline, nothing else. Legal only where the object actually passed
            verification.
          </p>
        </Card>
      </Row>

      <Row title="Well (inside a Card)">
        <Card className="w-96">
          <p className="ob-body mb-3">
            The excerpt below sits in a recessed Well — never a nested card. Recessed reads as
            darker here, not lighter.
          </p>
          <Well>
            <MetaLine parts={['EXAMPLE.COM', 'PUBLISHED 2026-02-14']} />
            <p className="ob-body mt-2">
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
            <button type="button" className="ob-text-action">
              [12]
            </button>
          }
        >
          <MetaLine parts={['EV_12', 'VERIFIED 2026-08-19 14:22']} className="mb-2" />
          <p>&ldquo;92% of dental no-shows are same-week cancellations.&rdquo;</p>
        </Popover>
      </Row>

      <Row title="Accordion (independent state, never auto-collapses siblings)">
        <div className="ob-prose w-full">
          <Accordion title="What we found" defaultOpen>
            <p className="ob-body">
              12 findings support this claim. Expanding one accordion never closes another.
            </p>
          </Accordion>
          <Accordion title="Who else is doing this">
            <p className="ob-body">3 competitors identified.</p>
          </Accordion>
        </div>
      </Row>

      <Row title="Divider">
        <div className="w-full">
          <Divider />
        </div>
      </Row>

      <Row title="SectionLabel — a numeral, the label, and a hairline running off right. No brackets, no blue.">
        <div className="w-full">
          <SectionLabel index="01">What we found</SectionLabel>
        </div>
        <div className="w-full">
          <SectionLabel>Recent runs</SectionLabel>
        </div>
      </Row>

      <Row title="MetaLine — wraps rather than truncating (R21); middot separators">
        <div className="w-full">
          <MetaLine
            parts={[
              'RUN 7f3a91c4',
              '19 QUERIES',
              '31 PAGES FETCHED',
              '47 VERIFIED',
              '18 DISCARDED',
            ]}
          />
        </div>
        <div style={{ width: 320 }}>
          <MetaLine parts={['CHAIRSYNC', 'US, INDEPENDENT PRACTICES', '$299/MO PER LOCATION']} />
        </div>
      </Row>

      <Row title="Prose">
        <Prose className="w-full">
          <p>
            A person arrives with a half-formed idea. What survives verification becomes a report.
            This paragraph demonstrates the 580px measure and its leading.
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
            <button type="button" className="ob-text-action">
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

      {/* **`StatusBadge` has no call site in the product, and A14 decided it
          keeps none.** `RunFooterBar` does not carry it: `ALL SYSTEMS
          OPERATIONAL` is a status-page claim this product cannot make from a
          fixture, and its `.ob-dot` would put a second pulsing accent dot in
          the same viewport as `PhaseStrip`'s active phase — which is capped at
          one. This gallery is its only home; nobody should go hunting for
          where it renders. */}
      <Row title="StatusBadge — no call site, by decision">
        <StatusBadge />
      </Row>
    </Section>
  );
}
