import { StatusBadge } from '@/components/status/status-badge';
import { Wordmark } from './wordmark';

/** The elevated rounded footer, `/` only. Run pages get the thin `RunFooterBar` instead. */
export function FooterPanel() {
  return (
    <div className="footer-wrapper">
      <div className="footer-panel mx-auto flex w-full max-w-marketing flex-col gap-8">
        <div>
          <div className="pb-2">
            <Wordmark />
          </div>
          <p style={{ color: 'var(--text-body)' }}>Takes a vague idea and makes it clearer.</p>
        </div>
        <div className="flex items-center justify-between">
          <StatusBadge />
          <span className="meta-line">© 2026</span>
        </div>
      </div>
    </div>
  );
}
