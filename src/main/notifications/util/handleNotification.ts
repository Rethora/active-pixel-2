import { Notification } from 'electron';
import {
  DailyProgress,
  DailyProgressNotification,
  Schedule,
} from '../../../shared/types/schedule';
import storePromise from '../../store';
import { Settings } from '../../../shared/types/settings';

type Options = {
  ignoreSilence?: boolean;
  schedule?: Schedule;
  type?: 'suggestion' | 'system';
};

export default async (notification: Notification, options: Options = {}) => {
  let shouldShow = true;
  if (options.type === 'system') {
    shouldShow = true;
  }

  const store = await storePromise;
  const settings = (await store.get('settings')) as Settings;

  // Only track scheduled notifications
  if (options.type === 'suggestion' && options.schedule) {
    const dailyProgress = (await store.get('dailyProgress')) as DailyProgress;
    const notificationId = `${options.schedule.id}_${new Date().toISOString()}`;

    // Check do not disturb status
    if (settings.doNotDisturb) {
      const now = new Date();
      if (settings.turnOffDoNotDisturbAt) {
        const turnOffAt = new Date(settings.turnOffDoNotDisturbAt);
        if (now < turnOffAt) {
          shouldShow = false;
        }
        // Auto turn off do not disturb if we're past the turn off time
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

    // Check schedule-specific silence
    if (options.schedule.silenceNotificationsUntil) {
      const now = new Date();
      const silenceUntil = new Date(options.schedule.silenceNotificationsUntil);
      if (now < silenceUntil) {
        shouldShow = false;
      }
      const schedules = (await store.get('schedules')) as Schedule[];
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

    // Add to daily progress
    dailyProgress.notifications.push(newNotification);
    store.set('dailyProgress', dailyProgress);
  }

  if (shouldShow) {
    notification.show();
  }
};
