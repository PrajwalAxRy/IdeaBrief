import { Wordmark } from './wordmark';

/**
 * `/` navigation only — transparent → blur past 40px scroll, done with a
 * pure CSS scroll-driven animation (`animation-timeline: scroll()`), so no
 * scroll-listener client component is needed. Separate from `RunShell`
 * because its behaviour and contents differ entirely.
 */
export function LandingNav() {
  return (
    <nav className="nav">
      <div className="mx-auto flex w-full max-w-marketing items-center justify-between px-8 py-4">
        <Wordmark />
        <div className="flex items-center gap-6">
          <a href="#what-you-get" className="text-action">
            How it works
          </a>
          <a href="#the-box" className="btn btn-secondary btn-sm">
            Start
          </a>
        </div>
      </div>
    </nav>
  );
}
