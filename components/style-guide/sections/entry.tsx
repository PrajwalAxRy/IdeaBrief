'use client';

import { Hero } from '@/components/entry/hero';
import { RecentRunsList } from '@/components/entry/recent-runs-list';
import { TrustSection } from '@/components/entry/trust-section';
import { WhatYouGet } from '@/components/entry/what-you-get';
import { upsertRecentRun } from '@/lib/hooks/use-recent-runs';
import { useEffect } from 'react';
import { Row, Section } from '../section';

function RecentRunsListDemo() {
  useEffect(() => {
    upsertRecentRun({
      slug: 'sms-rebooking-4f2a',
      oneLiner: 'SMS rebooking for dental clinics',
      stage: 'validating',
      // Not `new Date(0)`: this writes to the app's real `sv.runs` key, so an
      // epoch timestamp follows you to `/` and renders there as "57 years ago".
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    });
  }, []);

  return <RecentRunsList />;
}

export function EntrySection() {
  return (
    <Section id="entry" title="Entry" note="components/entry/* — the `/` landing page, in place.">
      <Row title="Hero (headline, The Box, orb — full composed section)">
        <div className="w-full border" style={{ borderColor: 'var(--border-subtle)' }}>
          <Hero />
        </div>
      </Row>

      <Row title="RecentRunsList (seeded with a demo run)">
        <div className="w-full">
          <RecentRunsListDemo />
        </div>
      </Row>

      <Row title="TrustSection">
        <div className="w-full">
          <TrustSection />
        </div>
      </Row>

      <Row title="WhatYouGet">
        <div className="w-full">
          <WhatYouGet />
        </div>
      </Row>
    </Section>
  );
}
