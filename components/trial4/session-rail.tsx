import { type ChatSession, SESSION_GROUPS, STAGE_LABEL, type Stage } from '@/lib/content/trial4';

type Props = {
  sessions: ChatSession[];
  activeId: string;
  /** Where the OPEN run is, so the live dot cannot contradict the stage rail. */
  runStage: Stage;
  onSelect: (id: string) => void;
};

/**
 * The left column: every previous conversation, grouped by recency.
 *
 * Selection reads as a surface step plus a border — `--ob-surface` inside the
 * `--ob-void` rail — and not as an accent. Blue has three jobs and "this row is
 * selected" is none of them. The one accent in this column is the live dot on
 * the open run, which is the third job exactly.
 *
 * Each row's stage comes from `sessions`, but the OPEN row reads `runStage`
 * instead, passed down rather than stored. Otherwise approving the brief moves
 * the stage rail forward and leaves this column two hundred pixels away still
 * claiming DEFINE.
 */
export function SessionRail({ sessions, activeId, runStage, onSelect }: Props) {
  return (
    <aside className="t4-col t4-rail">
      <div className="t4-head">
        <span className="ob-meta">Conversations</span>
        <button type="button" className="t4-new">
          New idea
        </button>
      </div>

      <div className="t4-scroll">
        <div className="t4-rail-list">
          {SESSION_GROUPS.map((group) => {
            const rows = sessions.filter((session) => session.group === group);
            if (rows.length === 0) return null;

            return (
              <section key={group}>
                <h2 className="t4-group ob-meta">{group}</h2>

                {rows.map((session) => {
                  const open = session.id === activeId;
                  const stage = open ? runStage : session.stage;

                  return (
                    <button
                      key={session.id}
                      type="button"
                      className="t4-session"
                      aria-current={open}
                      onClick={() => onSelect(session.id)}
                    >
                      <span className="t4-session-title">{session.title}</span>

                      <span className="t4-session-meta">
                        {open ? <span className="ob-dot" aria-hidden="true" /> : null}
                        <span className="ob-meta">{STAGE_LABEL[stage]}</span>
                        <span className="ob-meta" aria-hidden="true">
                          ·
                        </span>
                        <span className="ob-meta">{session.when}</span>
                      </span>
                    </button>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
