import { Well } from '@/components/ui/well';

/**
 * The cut list, given full reading weight — not muted, not struck through
 * (08: "this list is content, not caveat"). Plain Server Component; nothing
 * here is interactive.
 */
export function NotInItList({ items }: { items: string[] }) {
  return (
    <Well padding="none" className="p-5 flex flex-col gap-2">
      <span className="evidence-field-label">Not in it</span>
      <ul className="cut-list-items">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Well>
  );
}
