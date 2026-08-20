import { VerifiedBadge } from '@/components/status/verified-badge';
import { Card } from '@/components/ui/card';
import { DisplayHeadline } from '@/components/ui/display-headline';
import { Reveal } from '@/components/ui/reveal';
import { SectionLabel } from '@/components/ui/section-label';

/** A fragment of the Brief Panel: fields resolving from blank to filled. */
function BriefPanelMedia() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6">
      <div className="skeleton" style={{ height: 10, width: '40%' }} />
      <div
        style={{
          height: 10,
          width: '70%',
          background: 'var(--text-primary)',
          borderRadius: 'var(--r-md)',
        }}
      />
      <div className="skeleton" style={{ height: 10, width: '55%' }} />
    </div>
  );
}

/** A fragment of the Finding stream: a VERIFIED badge landing. */
function FindingStreamMedia() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6">
      <div className="well flex items-center justify-between p-3">
        <div
          style={{
            height: 8,
            width: '60%',
            background: 'var(--border-medium)',
            borderRadius: 'var(--r-md)',
          }}
        />
        <VerifiedBadge />
      </div>
      <div
        style={{
          height: 8,
          width: '45%',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--r-md)',
        }}
      />
    </div>
  );
}

/** A fragment of an Open Question Card: a numbered script. */
function ScriptMedia() {
  return (
    <div
      className="well flex h-full flex-col justify-center gap-2 px-6 py-4"
      style={{ margin: 24 }}
    >
      <span className="meta-line">THE SCRIPT</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
        1. Ask about their current process
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-body)' }}>
        2. Ask what they've tried before
      </span>
    </div>
  );
}

const FEATURES = [
  {
    number: '01',
    title: 'A clear description',
    body: 'An AI asks what it needs to ask, then writes down what you\'re actually building. "I don\'t know" is a fine answer to anything.',
    media: BriefPanelMedia,
  },
  {
    number: '02',
    title: 'What the web already says',
    body: 'A research run across five dimensions. Every claim links to a real page, and every quote is checked against it.',
    media: FindingStreamMedia,
  },
  {
    number: '03',
    title: 'What to do on Monday',
    body: 'The questions only real people can answer, with the interview scripts written out — and a build plan wired to them.',
    media: ScriptMedia,
  },
];

export function WhatYouGet() {
  return (
    <section className="py-24">
      <SectionLabel>What you get</SectionLabel>
      <DisplayHeadline
        muted="Three things,"
        bright="in about ten minutes."
        as="h2"
        className="pb-12"
      />

      <div className="grid grid-cols-3 gap-6">
        {FEATURES.map((feature, index) => (
          <Reveal key={feature.number} delayMs={index * 90}>
            <Card padding="none">
              <div
                style={{
                  height: 240,
                  background: 'var(--bg-base)',
                  borderBottom: '1px solid var(--border-subtle)',
                  overflow: 'hidden',
                  borderTopLeftRadius: 'var(--r-lg)',
                  borderTopRightRadius: 'var(--r-lg)',
                }}
              >
                <feature.media />
              </div>
              <div className="flex flex-col gap-3 p-6">
                <span className="meta-line">{feature.number}</span>
                <h3 style={{ color: 'var(--text-primary)', fontSize: 'var(--text-h3)' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'var(--text-body)' }}>{feature.body}</p>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
