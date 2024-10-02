import type { Timestamp } from 'firebase/firestore';

const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat('en-gb', {
  style: 'short',
  numeric: 'auto'
});

type Units = Readonly<Partial<Record<Intl.RelativeTimeFormatUnit, number>>>;

const UNITS: Units = {
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000
};

export function formatDate(
  targetDate: Timestamp | undefined, // Allow undefined
  mode: 'full' | 'joined'
): string {
  if (!targetDate) {
    return 'Invalid date'; // Handle undefined date
  }

  const date = targetDate.toDate();

  if (mode === 'full') return getFullTime(date);
  if (mode === 'joined') return getJoinedTime(date);

  return 'Unknown format'; // Default case
}

function getFullTime(date: Date): string {
  const fullDate = new Intl.DateTimeFormat('en-gb', {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);

  const splittedDate = fullDate.split(', ');

  const formattedDate =
    splittedDate.length === 2
      ? [...splittedDate].reverse().join(' · ')
      : [splittedDate.slice(0, 2).join(', '), splittedDate.slice(-1)]
          .reverse()
          .join(' · ');

  return formattedDate;
}

function getJoinedTime(date: Date): string {
  return new Intl.DateTimeFormat('en-gb', {
    month: 'long',
    year: 'numeric'
  }).format(date);
}
