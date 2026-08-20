import { SectionLabel } from '@/components/ui/section-label';
import type { ReactNode } from 'react';

export function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="flex scroll-mt-24 flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary)', fontWeight: 700 }}>
          {title}
        </h2>
        {note && <p className="meta-line">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel>{title}</SectionLabel>
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}
