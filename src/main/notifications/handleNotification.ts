import { Notification } from 'electron';
import {
  DailyProgressNotification,
  Schedule,
} from '../../shared/types/schedule';
import store from '../store';
import {
  DayOfWeek,
  DoNotDisturbSchedule,
} from '../../shared/types/doNotDisturbSchedules';

type Options = {
  ignoreSilence?: boolean;
  schedule?: Schedule;
  type?: 'suggestion' | 'system';
};

const isWithinExcludedTimeFrame = (schedule: DoNotDisturbSchedule): boolean => {
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

export default (notification: Notification, options: Options = {}) => {
  let shouldShow = true;
  if (options.type === 'system') {
    shouldShow = true;
  }

  // * check do not disturb schedules for all notifications except system
  if (options.type !== 'system') {
    const settings = store.get('settings');
    const doNotDisturbSchedules = store.get('doNotDisturbSchedules');
    // * Check do not disturb schedules
    if (doNotDisturbSchedules.some(isWithinExcludedTimeFrame)) {
      shouldShow = false;
    }
    // * Check global do not disturb status
    if (settings.doNotDisturb) {
      const now = new Date();
      if (settings.turnOffDoNotDisturbAt) {
        const turnOffAt = new Date(settings.turnOffDoNotDisturbAt);
        if (now < turnOffAt) {
          shouldShow = false;
        }
        // * Auto turn off do not disturb if we're past the turn off time
        store.set('settings', {
          ...settings,
          doNotDisturb: false,
          turnOffDoNotDisturbAt: null,
        });
      } else {
        // * notifications silenced without a turn off time
        shouldShow = false;
      }
    }
  }

  // Only track scheduled notifications
  if (options.type === 'suggestion' && options.schedule) {
    const dailyProgress = store.get('dailyProgress');
    const notificationId = `${options.schedule.id}_${new Date().toISOString()}`;

    // * Check schedule-specific silence
    if (options.schedule.silenceNotificationsUntil) {
      const now = new Date();
      const silenceUntil = new Date(options.schedule.silenceNotificationsUntil);
      if (now < silenceUntil) {
        shouldShow = false;
      }
      const schedules = store.get('schedules');
      const updatedSchedules = schedules.map((s) =>
        s.id === options.schedule?.id
          ? { ...s, silenceNotificationsUntil: null }
          : s,
      );
      store.set('schedules', updatedSchedules);
    }

    const newNotification: DailyProgressNotification = {
      id: notificationId,
      scheduleId: options.schedule.id,
      scheduleName: options.schedule.name,
      timestamp: new Date().toISOString(),
      wasShown: shouldShow,
      completed: false,
    };

    // * Add scheduled notifications to daily progress
    dailyProgress.notifications.push(newNotification);
    store.set('dailyProgress', dailyProgress);
  }

  if (shouldShow) {
    notification.show();
  }
};
