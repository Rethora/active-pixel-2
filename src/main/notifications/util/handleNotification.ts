import { Notification } from 'electron';
import { Schedule } from '../../../shared/types/schedule';
import storePromise from '../../store';
import { Settings } from '../../../shared/types/settings';

type Options = {
  ignoreSilence?: boolean;
  schedule?: Schedule;
};

export default async (notification: Notification, options: Options = {}) => {
  if (!options.ignoreSilence) {
    const store = await storePromise;
    const settings = (await store.get('settings')) as Settings;

    // Check do not disturb status
    if (settings.doNotDisturb) {
      const now = new Date();
      if (settings.turnOffDoNotDisturbAt) {
        const turnOffAt = new Date(settings.turnOffDoNotDisturbAt);
        if (now < turnOffAt) {
          return;
        }
        // Auto turn off do not disturb if we're past the turn off time
        store.set('settings', {
          ...settings,
          doNotDisturb: false,
          turnOffDoNotDisturbAt: null,
        });
      } else {
        // * notifications silenced without a turn off time
        return;
      }
    }

    // Check schedule-specific silence
    if (options.schedule) {
      if (options.schedule.silenceNotificationsUntil) {
        const now = new Date();
        const silenceUntil = new Date(
          options.schedule.silenceNotificationsUntil,
        );
        if (now < silenceUntil) {
          return;
        }
        const schedules = (await store.get('schedules')) as Schedule[];
        const updatedSchedules = schedules.map((s) =>
          s.id === options.schedule?.id
            ? { ...s, silenceNotificationsUntil: null }
            : s,
        );
        store.set('schedules', updatedSchedules);
      }
    }
  }

  notification.show();
};
