import { ROADMAP } from '@/lib/content/app';
import { waitLabel } from '@/lib/run-plan';
import type { SetupItem } from '@/lib/schemas/roadmap';
import { AmbushLine } from './ambush-line';

/**
 * The admin, off the chart entirely.
 *
 * **This is where A17 put the five bars that used to make the chart
 * unreadable.** A domain purchase and a carrier registration are not steps in a
 * journey — one takes ten minutes and the other is three weeks of *waiting* —
 * and drawing them next to "build the product" implied they were comparable
 * efforts. As a flat list with no timeline, they read in about twenty seconds.
 *
 * **But the waits stayed, and got louder.** Two of these five are queues
 * somebody else controls, and the difference between starting them today and
 * starting them when you need them is roughly two months. That fact was
 * previously encoded as a bar treatment plus a legend; here it is a tag on the
 * row and a number in the lead. It is also where the only two research-backed
 * ambushes on this page live, which is worth noticing rather than hiding at the
 * bottom of a boring list.
 */
export function SetupList({ items }: { items: SetupItem[] }) {
  return (
    <ul className="ob-setup-list">
      {items.map((item) => {
        const wait = waitLabel(item);
        return (
          <li className="ob-setup-item" key={item.id} data-queue={wait ? '' : undefined}>
            <div className="ob-setup-head">
              <h3 className="ob-setup-name">{item.label}</h3>
              {wait ? (
                <p className="ob-setup-wait">
                  <span className="ob-setup-wait-tag ob-meta">{ROADMAP.setup.queueTag}</span>
                  <span className="ob-setup-wait-value">{wait}</span>
                </p>
              ) : (
                <p className="ob-setup-band">
                  <span className="ob-money-band" data-band={item.cost}>
                    {item.cost === 'free' ? '—' : item.cost}
                  </span>
                </p>
              )}
            </div>

            <p className="ob-setup-detail">{item.detail}</p>
            <p className="ob-setup-when">{item.when}</p>

            {item.ambushes.length > 0 && (
              <ul className="ob-ambush-list ob-setup-ambushes">
                {item.ambushes.map((ambush) => (
                  <AmbushLine ambush={ambush} key={ambush.id} />
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}
