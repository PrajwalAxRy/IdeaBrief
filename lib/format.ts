const relativeTimeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
];

/** e.g. "3 days ago", "in 2 hours". */
export function formatRelativeTime(isoDate: string, now: Date = new Date()): string {
  let duration = (new Date(isoDate).getTime() - now.getTime()) / 1000;
  for (const division of DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return relativeTimeFormatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return relativeTimeFormatter.format(Math.round(duration), 'years');
}

/** e.g. "https://example.com/path" -> "example.com". */
export function formatDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/** e.g. 1200 -> "1.2k", 47 -> "47". */
export function formatCount(count: number): string {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

/** e.g. 72_000 -> "1:12". PhaseStrip shows elapsed time, never a percentage. */
export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/** e.g. "2026-08-14T09:12:00.000Z" -> "14 Aug 2026". The report's "Researched {date}". */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

const MONTH_ABBR = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

/**
 * The fixture stores a dimension's span as `"2025-01 to 2025-12"`, which is a
 * database value, not a line a reader should meet. e.g. `"JAN–DEC 2025"`, and
 * `"SEP–OCT 2025"` for a two-month span. A range crossing a year keeps both.
 *
 * Returns the input unchanged if it doesn't parse — a meta line showing a raw
 * value is better than one showing `undefined`.
 */
export function formatMonthRange(range: string): string {
  const match = /^(\d{4})-(\d{2})\s+to\s+(\d{4})-(\d{2})$/.exec(range.trim());
  if (!match) return range.toUpperCase();
  const [, fromYear, fromMonth, toYear, toMonth] = match;
  const from = MONTH_ABBR[Number(fromMonth) - 1];
  const to = MONTH_ABBR[Number(toMonth) - 1];
  return fromYear === toYear
    ? `${from}–${to} ${fromYear}`
    : `${from} ${fromYear} – ${to} ${toYear}`;
}

const clockFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/** e.g. "2026-08-14T09:12:00.000Z" -> "09:12". The Define Meta Line's "STARTED {time}". */
export function formatClockTime(isoDate: string): string {
  return clockFormatter.format(new Date(isoDate));
}
