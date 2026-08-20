import { Card } from '@/components/ui/card';

/**
 * The `featured` card holding two or three numbered surprises — deliberately
 * the most visually weighted block in the report (the screenshot moment).
 */
export function SurprisePanel({ surprises }: { surprises: string[] }) {
  return (
    <Card featured padding="feature" className="flex flex-col gap-8">
      {surprises.map((surprise, index) => (
        <div key={surprise} className="flex gap-4">
          <span className="surprise-number">{String(index + 1).padStart(2, '0')}</span>
          <p className="surprise-text">{surprise}</p>
        </div>
      ))}
    </Card>
  );
}
