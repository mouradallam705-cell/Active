import { LogEntry, StreakStats } from '../types';

/**
 * Calculates current and historical streaks from log entries.
 * Returns updated logs with recalculated streakCount for each entry,
 * plus summary StreakStats.
 */
export function processLogsAndCalculateStats(rawLogs: LogEntry[]): {
  processedLogs: LogEntry[];
  stats: StreakStats;
} {
  if (!rawLogs || rawLogs.length === 0) {
    return {
      processedLogs: [],
      stats: {
        currentStreak: 0,
        longestStreak: 0,
        totalDaysLogged: 0,
        totalExercised: 0,
        totalMissed: 0,
        complianceRate: 0,
      },
    };
  }

  // Sort chronologically ascending (oldest first)
  const sortedLogs = [...rawLogs].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return (a.time || '00:00').localeCompare(b.time || '00:00');
  });

  let runningStreak = 0;
  let maxStreak = 0;
  let totalExercised = 0;
  let totalMissed = 0;
  let lastExercisedDate: string | undefined = undefined;

  const processedLogs = sortedLogs.map((entry) => {
    if (entry.status === 'exercised') {
      runningStreak += 1;
      totalExercised += 1;
      lastExercisedDate = entry.date;
    } else {
      runningStreak = 0; // RESET TO DAY 0!
      totalMissed += 1;
    }

    if (runningStreak > maxStreak) {
      maxStreak = runningStreak;
    }

    return {
      ...entry,
      streakCount: runningStreak,
    };
  });

  const totalDaysLogged = processedLogs.length;
  const complianceRate = totalDaysLogged > 0 
    ? Math.round((totalExercised / totalDaysLogged) * 100) 
    : 0;

  // The final active current streak is the runningStreak after processing the latest log
  const currentStreak = runningStreak;

  return {
    processedLogs: processedLogs.reverse(), // Reverse to display newest first in UI lists
    stats: {
      currentStreak,
      longestStreak: maxStreak,
      totalDaysLogged,
      totalExercised,
      totalMissed,
      complianceRate,
      lastExercisedDate,
    },
  };
}

/**
 * Arabic Months names lookup
 */
export const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

export const ARABIC_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
];

/**
 * Format date string YYYY-MM-DD to Arabic long readable date
 */
export function formatArabicDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;

  const dateObj = new Date(y, m - 1, d);
  const dayNameIndex = (dateObj.getDay() + 1) % 7; // Saturday = 0
  const dayName = ARABIC_DAYS[dayNameIndex] || '';
  const monthName = ARABIC_MONTHS[m - 1] || '';

  return `${dayName}، ${d} ${monthName} ${y}`;
}

/**
 * Format HH:mm to 12-hour Arabic time string (e.g. 06:30 مساءً / 09:15 صباحاً)
 */
export function formatArabicTime(timeStr: string): string {
  if (!timeStr) return '';
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr || '00';
  if (isNaN(h)) return timeStr;

  const period = h >= 12 ? 'مساءً' : 'صباحاً';
  h = h % 12;
  if (h === 0) h = 12;

  return `${h}:${m} ${period}`;
}

/**
 * Get Today's Date String in YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get Current Time String in HH:mm
 */
export function getCurrentTimeString(): string {
  const d = new Date();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
