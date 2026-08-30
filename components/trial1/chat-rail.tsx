import { BUCKETS, type Chat } from '@/lib/content/trial1';
import { Plus, Settings } from 'lucide-react';

type Props = {
  chats: Chat[];
  activeId: string;
  onSelect: (id: string) => void;
};

/**
 * Previous chats, grouped by recency.
 *
 * **Rows are not cards.** Fourteen bordered cards in a 280px column turns the
 * rail into a ladder and puts more hairlines on screen than content. A row is
 * transparent on the linen ground, lifts one tier to paper on hover, and takes
 * the CHOSEN near-black border when selected — `--rl-line-ink`, not the accent,
 * because this is a selection and the accent marks live state, not choice.
 *
 * "New idea" is deliberately `--secondary`. Exactly one primary is visible per
 * viewport and that budget is spent on the composer's send control, which is
 * the thing the user is actually here to press.
 */
export function ChatRail({ chats, activeId, onSelect }: Props) {
  return (
    <aside className="rl-pane rl-rail" aria-label="Previous chats">
      <div className="rl-rail__head">
        <button type="button" className="rl-btn rl-btn--secondary w-full">
          <Plus size={15} aria-hidden="true" />
          New idea
        </button>
      </div>

      {BUCKETS.map((bucket) => {
        const inBucket = chats.filter((chat) => chat.bucket === bucket);
        if (inBucket.length === 0) return null;

        return (
          <div key={bucket} className="rl-rail__group">
            <p className="rl-meta-sm rl-on-tint rl-rail__label">{bucket}</p>

            <ul className="flex flex-col gap-1">
              {inBucket.map((chat) => {
                const isActive = chat.id === activeId;
                return (
                  <li key={chat.id}>
                    <button
                      type="button"
                      className="rl-chat"
                      aria-current={isActive ? 'true' : undefined}
                      onClick={() => onSelect(chat.id)}
                    >
                      <span className="rl-chat__title">{chat.title}</span>
                      <span className="rl-chat__meta">
                        {/* On linen, a neutral chip's linen fill vanishes and
                            --rl-muted drops to 4.44:1. --on-tint fixes both. */}
                        <span className="rl-chip rl-chip--on-tint">
                          {chat.summary.coverage.answered}/{chat.summary.coverage.total}
                        </span>
                        <span className="rl-meta-sm rl-on-tint">{chat.updated}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      <div className="rl-rail__foot">
        <button type="button" className="rl-btn rl-btn--quiet rl-btn--sm">
          <Settings size={15} aria-hidden="true" />
          Settings
        </button>
      </div>
    </aside>
  );
}
