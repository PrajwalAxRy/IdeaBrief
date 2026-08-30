import type { ChatSession } from '@/lib/content/trial3';

/**
 * The left rail — previous conversations.
 *
 * No `'use client'` of its own: it is a presentational leaf whose parent
 * (`Workspace`) already carries the boundary, and it holds no state.
 *
 * The rail sits on `--au-void`, so a selected row steps **up** toward the
 * paper (`--au-surface`) rather than darkening. That is the tier rule, not a
 * style preference: a hairline measures 1.14:1 against the toasted band and
 * does not render, so the tier step has to make the edge and the border only
 * confirms it. Audacity §5.
 */
export function ChatRail({
  sessions,
  activeId,
  onSelect,
}: {
  sessions: ChatSession[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  let lastGroup = '';

  return (
    <aside className="au-ws-rail" data-side="left" aria-label="Previous conversations">
      <div className="au-ws-rail-head">
        <span className="au-meta">Chats</span>
        <button type="button" className="au-btn au-btn-bare au-xs">
          <span aria-hidden="true">+</span> New
        </button>
      </div>

      <div className="au-ws-rail-scroll">
        {sessions.map((session) => {
          const isActive = session.id === activeId;
          const showGroup = session.group !== lastGroup;
          lastGroup = session.group;

          return (
            <div key={session.id}>
              {showGroup ? <p className="au-ws-group au-meta au-meta-sm">{session.group}</p> : null}

              <button
                type="button"
                className="au-ws-chat"
                aria-current={isActive}
                onClick={() => onSelect(session.id)}
              >
                <span className="au-ws-chat-title">{session.title}</span>
                <span className="au-ws-chat-meta">
                  {/* Live/active — one of the accent's three jobs, and the only
                      thing in this rail permitted to carry it. */}
                  {isActive ? <span className="au-dot" aria-hidden="true" /> : null}
                  <span className="au-meta au-meta-xs">{session.stage}</span>
                  <span className="au-meta au-meta-xs" aria-hidden="true">
                    ·
                  </span>
                  <span className="au-meta au-meta-xs">{session.when}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
