import type { SummaryField } from '@/lib/content/trial3';

/**
 * The right rail — everything said so far, resolved into the nine brief
 * fields, updating as each scripted reply lands.
 *
 * **An empty field stays empty.** `null` renders as "Not yet" rather than as a
 * plausible sentence: the product definition's oldest rule is that nothing is
 * invented to fill a field, and a summary panel is the single easiest place in
 * a chat product to break it.
 *
 * The just-landed field flashes `--au-accent-wash` and decays. That is the
 * accent's live/active job — it marks the thing the run is doing right now —
 * and it is the only accent in this rail. The progress meter deliberately does
 * **not** get one: a count of filled fields is neither an action, a
 * verification, nor a live state.
 */
export function SummaryRail({
  fields,
  freshKey,
}: {
  fields: SummaryField[];
  freshKey: string | null;
}) {
  const filled = fields.filter((field) => field.value !== null).length;

  return (
    <aside className="au-ws-rail" data-side="right" aria-label="Brief so far">
      <div className="au-ws-rail-head">
        <span className="au-meta">Summary</span>
        <span className="au-meta au-meta-sm">
          {filled} / {fields.length}
        </span>
      </div>

      <div className="au-ws-rail-scroll">
        <div className="au-ws-meter" role="presentation">
          <span
            className="au-ws-meter-fill"
            style={{ width: `${Math.round((filled / fields.length) * 100)}%` }}
          />
        </div>

        <div className="mt-2">
          {fields.map((field) => (
            <div
              key={field.key}
              className="au-ws-field"
              data-filled={field.value !== null}
              data-fresh={field.key === freshKey}
            >
              <p className="au-meta au-meta-sm">{field.label}</p>
              <p className="au-ws-field-value">{field.value ?? 'Not yet'}</p>
            </div>
          ))}
        </div>

        <p className="au-xs mt-6" style={{ color: 'var(--au-muted)' }}>
          Every line here is something you said. Nothing is filled in for you.
        </p>
      </div>
    </aside>
  );
}
