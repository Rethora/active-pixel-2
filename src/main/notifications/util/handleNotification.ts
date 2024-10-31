import { Notification } from 'electron';
import { Schedule } from '../../../shared/types/schedule';
import storePromise from '../../store';

type Options = {
  ignoreSilence?: boolean;
  schedule?: Schedule;
};

export default async (notification: Notification, options: Options = {}) => {
  if (!options.ignoreSilence) {
    return;
  }

  if (options.schedule) {
    if (options.schedule.silenceNotificationsUntil) {
      const now = new Date();
      const silenceUntil = new Date(options.schedule.silenceNotificationsUntil);
      if (now < silenceUntil) {
        return;
      }
      const store = await storePromise;
      const schedules = (await store.get('schedules')) as Schedule[];
      const updatedSchedules = schedules.map((s) =>
        s.id === options.schedule?.id
          ? { ...s, silenceNotificationsUntil: null }
          : s,
      );
      store.set('schedules', updatedSchedules);
    }
  }

  notification.show();
};
