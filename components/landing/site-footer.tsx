import { BRAND, FOOTER } from '@/lib/content/landing';
import { ScrollReveal } from './scroll-reveal';

/**
 * Closes the page with a hairline, the practical facts, and an oversized ghost
 * wordmark — stroke only, no fill, so it reads as a watermark rather than one
 * more headline shouting at the end.
 */
export function SiteFooter() {
  return (
    <footer className="ob-footer">
      <div className="ob-container pt-24 pb-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto_auto] gap-20">
          <div className="max-w-[38ch]">
            <p className="ob-h3">{BRAND.name}</p>
            <p className="ob-body mt-4 text-[15px]">{FOOTER.note}</p>
          </div>

          {FOOTER.columns.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4">
              <p className="ob-meta">{column.heading}</p>
              {column.links.map((link) => (
                <a key={link.label} href={link.href} className="ob-footer-link">
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <ScrollReveal delay={80}>
          <p className="ob-footer-mark mt-24 select-none" aria-hidden="true">
            {BRAND.name}
          </p>
        </ScrollReveal>

        <hr className="ob-rule mt-16" />

        <div className="flex items-center justify-between gap-8 pt-8">
          <p className="ob-meta">{FOOTER.legal}</p>
          <p className="ob-meta">No accounts · No billing · No tracking</p>
        </div>
      </div>
    </footer>
  );
}
