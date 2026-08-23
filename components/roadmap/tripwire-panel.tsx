import { ROADMAP } from '@/lib/content/app';
import type { Tripwire } from '@/lib/schemas/roadmap';

/**
 * Where "no verdict" lives.
 *
 * A tripwire never says the idea is weak. It names a thing that could come back
 * false and states the *different plan* that follows — which is the only useful
 * form this information can take for someone who has not built anything before.
 * "Risky" tells them nothing they can act on; "then the first thing to build is
 * the waitlist, not the messaging" tells them exactly what changes.
 *
 * Off the chart on purpose. A tripwire has no start, no duration and no place
 * in a sequence; giving it a bar would assert a schedule for something that is
 * a condition rather than a step.
 *
 * **A server component again after A17.** It held `useRoadmapNav` only to
 * render dependency chips back into the open questions; those chips went with
 * the rest of the cross-section wiring, and with them the last reason this
 * needed to be a client component.
 */
export function TripwirePanel({
  tripwires,
  thin = false,
}: {
  tripwires: Tripwire[];
  thin?: boolean;
}) {
  return (
    <section className="ob-tripwire" aria-labelledby="tripwire-h" data-thin={thin || undefined}>
      <h2 className="ob-tripwire-label" id="tripwire-h">
        {ROADMAP.tripwire.label}
      </h2>
      <p className="ob-tripwire-note">{thin ? ROADMAP.tripwire.thinNote : ROADMAP.tripwire.note}</p>

      <ul className="ob-tripwire-list">
        {tripwires.map((tripwire) => (
          <li key={tripwire.id} className="ob-tripwire-item">
            <p className="ob-tripwire-if">
              <span className="ob-meta">{ROADMAP.tripwire.ifLabel}</span> {tripwire.condition}
            </p>
            <p className="ob-tripwire-then">
              <span className="ob-meta">{ROADMAP.tripwire.thenLabel}</span> {tripwire.consequence}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
