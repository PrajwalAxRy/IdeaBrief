/** The 1px hairline that carves the layout. `.ob-rule` lives in
 *  styles/obsidian.css §2 and is consumed, not redeclared. */
export function Divider({ className = '' }: { className?: string }) {
  return <hr className={['ob-rule', className].filter(Boolean).join(' ')} />;
}
