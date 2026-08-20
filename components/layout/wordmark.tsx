import Link from 'next/link';
import { LogoMark } from './logomark';

/** The IdeaBrief brand mark: `LogoMark` + name, linking home. One definition
 * shared by `RunShell`, `LandingNav`, `FooterPanel`, and both not-found pages
 * so the mark only needs to change in one place. */
export function Wordmark() {
  return (
    <Link href="/" className="run-shell-wordmark">
      <LogoMark />
      IdeaBrief
    </Link>
  );
}
