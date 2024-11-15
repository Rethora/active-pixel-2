import cronParser from 'cron-parser';
import cronstrue from 'cronstrue';
import {
  DayOfWeek,
  DoNotDisturbSchedule,
} from '../types/doNotDisturbSchedules';

export const getNextRunTimeString = (value: string) => {
  try {
    const interval = cronParser.parseExpression(value);
    const date = interval.next().toDate();
    return date.toLocaleString('en-US', {
      weekday: 'long',
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (err) {
    return 'Invalid cron expression';
  }
};

export const getHumanReadableTimeSchedule = (value: string) => {
  return cronstrue.toString(value, { verbose: true });
};

export const isWithinExcludedTimeFrame = (
  schedule: DoNotDisturbSchedule,
): boolean => {
  const now = new Date();
  const currentDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][
    now.getDay()
  ] as DayOfWeek;
  if (!schedule.days.includes(currentDay)) {
    return false;
  }
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [startHours, startMinutes] = schedule.times[0].startTime
    .split(':')
    .map(Number);
  const [endHours, endMinutes] = schedule.times[0].endTime
    .split(':')
    .map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  return (
    currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes
  );
};
