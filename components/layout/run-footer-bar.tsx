import { CopyLinkButton } from '@/components/ui/copy-link-button';
import Link from 'next/link';
import { PageContainer } from './page-container';

/** The thin run-page footer: run ID, copy link, "Start another idea." */
export function RunFooterBar({ slug }: { slug: string }) {
  return (
    <footer className="run-footer-bar">
      <PageContainer variant="app">
        <div className="flex items-center justify-between py-4">
          <span className="meta-line">RUN {slug}</span>
          <div className="flex items-center gap-6">
            <CopyLinkButton slug={slug} />
            <Link href="/" className="text-action">
              Start another idea →
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
