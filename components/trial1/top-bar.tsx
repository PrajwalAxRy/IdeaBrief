import { StageSwitcher } from '@/components/trial1/stage-switcher';

/**
 * The L-shaped chrome. The brand block sits in the top bar's first column,
 * which is `--rl-rail` wide and carries a right hairline, so its edge continues
 * straight down into the chat rail's border — the two read as one piece of
 * chrome wrapping the workspace rather than as a strip on top of three columns.
 *
 * The mark is near-black, not the accent. Rule 4: the accent has three jobs and
 * "being the logo" is not one of them.
 */
export function TopBar() {
  return (
    <header className="rl-topbar">
      <div className="rl-topbar__brand">
        <span className="rl-topbar__mark" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <title>Groundwork</title>
            <path
              d="M1 9h10M3 6h6M5 3h2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="rl-topbar__wordmark">Groundwork</span>
      </div>

      <StageSwitcher current="define" />

      <div className="flex items-center gap-3">
        {/* Mono carries no sentences — this is a timestamp, which is exactly
            what the metadata layer is for. */}
        <span className="rl-meta">Saved 14:22</span>
        <button type="button" className="rl-btn rl-btn--quiet rl-btn--sm">
          Share
        </button>
      </div>
    </header>
  );
}
