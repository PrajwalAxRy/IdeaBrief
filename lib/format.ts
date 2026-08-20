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

const clockFormatter = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' });

/** e.g. "2026-08-14T09:12:00.000Z" -> "09:12". The Define Meta Line's "STARTED {time}". */
export function formatClockTime(isoDate: string): string {
  return clockFormatter.format(new Date(isoDate));
}
