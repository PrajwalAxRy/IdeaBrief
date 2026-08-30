import type { SummaryField } from '@/lib/content/trial4';

type Props = {
  fields: SummaryField[];
  /** The field whose value landed most recently, or `null` at rest. */
  freshKey: string | null;
};

/**
 * The right column: everything said so far, as the brief it is becoming.
 *
 * This is the reason the layout has three columns rather than two. The claim
 * the product makes is that a conversation turns into a structured brief with
 * nothing invented in it; watching a field fill the moment the answer lands is
 * that claim demonstrated instead of asserted.
 *
 * **An unanswered field is drawn, not guessed.** Two hairline bars of unequal
 * width and a mono label saying so. One bar would read as a loading skeleton,
 * which would be a lie — nothing is on its way until the conversation asks.
 *
 * The tick strip at the top is the same nine fields as a progress read, so the
 * column has an answer to "how much is left" without scrolling it.
 */
export function BriefRail({ fields, freshKey }: Props) {
  const filled = fields.filter((field) => field.value !== null).length;

  return (
    <aside className="t4-col t4-brief">
      <div className="t4-head">
        <span className="ob-meta">Brief</span>
        <span className="ob-meta">{`${filled}/${fields.length}`}</span>
      </div>

      <div className="t4-ticks" aria-hidden="true">
        {fields.map((field) => (
          <span key={field.key} className="t4-tick" data-on={field.value !== null} />
        ))}
      </div>

      <div className="t4-scroll">
        <dl className="t4-fields">
          {fields.map((field) => (
            <div
              key={field.key}
              className={`t4-field${field.key === freshKey ? ' t4-field-fresh' : ''}`}
            >
              <dt className="t4-field-label">
                <span className="ob-meta">{field.label}</span>
                {field.value === null ? <span className="ob-chip">Not yet</span> : null}
              </dt>

              <dd>
                {field.value !== null ? (
                  <p className="t4-field-value">{field.value}</p>
                ) : (
                  <div className="t4-field-bars" aria-label="Not answered yet">
                    <span className="t4-field-bar" style={{ width: '100%' }} />
                    <span className="t4-field-bar" style={{ width: '58%' }} />
                  </div>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  );
}
