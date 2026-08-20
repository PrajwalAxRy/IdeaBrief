import { BoxSection } from '@/components/entry/box-section';
import { Hero } from '@/components/entry/hero';
import { RecentRunsList } from '@/components/entry/recent-runs-list';
import { TrustSection } from '@/components/entry/trust-section';
import { WhatYouGet } from '@/components/entry/what-you-get';
import { FooterPanel } from '@/components/layout/footer-panel';
import { LandingNav } from '@/components/layout/landing-nav';
import { PageContainer } from '@/components/layout/page-container';
import { SkipLink } from '@/components/ui/skip-link';

export default function Home() {
  return (
    <>
      <SkipLink />
      <LandingNav />
      <main id="main">
        <PageContainer variant="marketing">
          <Hero />
          <div id="what-you-get">
            <WhatYouGet />
          </div>
          <BoxSection />
          <TrustSection />
          <RecentRunsList />
        </PageContainer>
      </main>
      <FooterPanel />
    </>
  );
}
