import { ROADMAP } from '@/lib/content/app';
import type { Money } from '@/lib/schemas/roadmap';

/**
 * What it costs to run — the shortest section on the page, deliberately.
 *
 * The bands already ride the bars in the chart, so this block only carries the
 * three things the chart cannot say: what a band actually means in money, the
 * free credit that exists and when applying for it is a mistake, and the one
 * piece of arithmetic whose number *is* the insight.
 *
 * **Prices appear in exactly two places on this page**: the legend, which has
 * to anchor the bands in something real or they mean nothing, and the
 * calibration line, where "42 practices is $100,000 a year" changes a pricing
 * decision in a way no band could. Everywhere else a price would simply rot.
 */
export function MoneyBlock({ money }: { money: Money }) {
  return (
    <div className="ob-money">
      <p className="ob-money-headline">{money.headline}</p>

      <div className="ob-money-cols">
        <div className="ob-money-col">
          <p className="ob-money-label ob-meta">{ROADMAP.money.itemsLabel}</p>
          <ul className="ob-money-items">
            {money.items.map((item) => (
              <li className="ob-money-item" key={item.label}>
                <span className="ob-money-band" data-band={item.band}>
                  {item.band === 'free' ? '—' : item.band}
                </span>
                <span className="ob-money-name">{item.label}</span>
                <span className="ob-money-when">{item.when}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ob-money-col">
          <p className="ob-money-label ob-meta">{ROADMAP.money.legendLabel}</p>
          <dl className="ob-money-legend">
            {money.legend.map((entry) => (
              <div className="ob-money-legend-row" key={entry.band}>
                <dt className="ob-money-band" data-band={entry.band}>
                  {entry.band === 'free' ? '—' : entry.band}
                </dt>
                <dd>{entry.meaning}</dd>
              </div>
            ))}
          </dl>

          <p className="ob-money-label ob-meta">{ROADMAP.money.creditsLabel}</p>
          <p className="ob-money-note">{money.credits}</p>

          <p className="ob-money-label ob-meta">{ROADMAP.money.calibrationLabel}</p>
          <p className="ob-money-note ob-money-calibration">{money.calibration}</p>
        </div>
      </div>
    </div>
  );
}
