'use client';

import { ApproveButton } from '@/components/define/approve-button';
import { BriefPanel } from '@/components/define/brief-panel';
import { Composer } from '@/components/define/composer';
import { DefineConversation } from '@/components/define/define-conversation';
import { DontKnowButton } from '@/components/define/dont-know-button';
import { SuggestionChip } from '@/components/define/suggestion-chip';
import { briefFixture } from '@/lib/fixtures/brief';
import { conversationFixture } from '@/lib/fixtures/conversation';
import { runFixture } from '@/lib/fixtures/run';
import { BRIEF_FIELD_KEYS } from '@/lib/schemas/brief';
import { Row, Section } from '../section';

const ALL_FIELDS_REVEALED = new Set(BRIEF_FIELD_KEYS);

export function DefineSection() {
  return (
    <Section
      id="define"
      title="Define"
      note="components/define/* — DefineConversation plays the scripted fixture conversation on its own timer, so the Brief Panel below it fills in progressively."
    >
      <Row title="DefineConversation (full composed flow, self-animating)">
        <div className="w-full border" style={{ borderColor: 'var(--border-subtle)' }}>
          <DefineConversation
            slug={runFixture.slug}
            run={runFixture}
            brief={briefFixture}
            conversation={conversationFixture}
          />
        </div>
      </Row>

      <Row title="BriefPanel (static snapshot, every field revealed)">
        <div className="w-full max-w-conversation">
          <BriefPanel
            brief={briefFixture}
            oneLinerOverride={briefFixture.one_liner.value as string}
            revealedFields={ALL_FIELDS_REVEALED}
            approved={false}
            approving={false}
            approvedAt={null}
            onApprove={() => {}}
          />
        </div>
      </Row>

      <Row title="Composer">
        <div className="w-full max-w-conversation">
          <Composer onSend={() => {}} onDontKnow={() => {}} />
        </div>
      </Row>

      <Row title="SuggestionChip">
        <SuggestionChip text="The front-desk person" onClick={() => {}} />
        <SuggestionChip text="The dentist" onClick={() => {}} />
      </Row>

      <Row title="ApproveButton">
        <ApproveButton pending={false} onClick={() => {}} />
        <ApproveButton pending onClick={() => {}} />
      </Row>

      <Row title="DontKnowButton">
        <DontKnowButton onClick={() => {}} />
      </Row>
    </Section>
  );
}
