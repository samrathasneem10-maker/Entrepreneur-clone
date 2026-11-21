export const WEBSITE_TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || 'America/New_York';

/**
 * Format a publication timestamp to exact date and time using website timezone.
 * Example output: "Nov 19, 2026, 5:15 AM EST"
 */
export function formatPublicationDate(input: string | Date | null | undefined): string {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) {
    return String(input);
  }
  return new Intl.DateTimeFormat('en-US', {
    timeZone: WEBSITE_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  }).format(d);
}

/**
 * Format a publication timestamp to date only if needed.
 * Example output: "Nov 19, 2026"
 */
export function formatPublicationDateOnly(input: string | Date | null | undefined): string {
  if (!input) return '';
  const d = typeof input === 'string' ? new Date(input) : input;
  if (isNaN(d.getTime())) {
    return String(input);
  }
  return new Intl.DateTimeFormat('en-US', {
    timeZone: WEBSITE_TIMEZONE,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
}
