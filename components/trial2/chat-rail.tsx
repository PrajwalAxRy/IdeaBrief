import { CHAT_GROUPS } from '@/lib/content/trial2';

/**
 * Previous chats. A server component — the rail has no state, so it is passed
 * into the client shell as `children` and never enters the client bundle.
 *
 * The live row is marked by stepping UP to paper with an `--ad-line-ink`
 * border, which is the system's "this one is chosen" border. It is near-black
 * rather than accent on purpose: the accent's three jobs are link, active/live
 * and focal point, and a selected row in a list is wayfinding that greyscale
 * already handles.
 */
export function ChatRail() {
  return (
    <>
      <div className="ad-colhead">
        <span className="ad-meta">Ideas</span>
        <button type="button" className="ad-btn ad-btn-secondary" style={{ padding: '7px 14px' }}>
          New
        </button>
      </div>

      <div className="ad-scroll">
        {CHAT_GROUPS.map((group) => (
          <div key={group.label} className="ad-railgroup">
            <div className="ad-railgroup-label">
              <span className="ad-meta">{group.label}</span>
            </div>

            {group.rows.map((row) => (
              <button
                key={row.id}
                type="button"
                disabled={row.live}
                aria-current={row.live ? 'true' : undefined}
                className={`ad-chatrow${row.live ? ' ad-chatrow-live' : ''}`}
              >
                <span className="ad-chatrow-title">{row.title}</span>
                <span className="ad-chatrow-meta">
                  {row.live ? (
                    <>
                      <span className="ad-dot" aria-hidden="true" />
                      <span className="ad-meta-sm" style={{ color: 'var(--ad-accent-text)' }}>
                        Live
                      </span>
                    </>
                  ) : (
                    <span className="ad-meta-sm" style={{ color: 'var(--ad-muted)' }}>
                      {row.stage}
                    </span>
                  )}
                  {/* `--ad-muted`, not `--ad-faint`. A timestamp is quiet, but
                      it is still text — `--ad-faint` measures 3.62:1 here. */}
                  <span className="ad-meta-sm" style={{ color: 'var(--ad-muted)' }}>
                    {row.when}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
