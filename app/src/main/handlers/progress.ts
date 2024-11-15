import { ipcMain } from 'electron';
import dayjs from 'dayjs';
import store from '../store';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';

export default () => {
  ipcMain.handle(
    'get-daily-progress',
    (): HandlerReturn<'get-daily-progress'> => {
      const dailyProgress = store.get('dailyProgress');

      // Check if we need to reset for a new day
      const today = dayjs().format('YYYY-MM-DD');
      if (dailyProgress.lastResetDate !== today) {
        const newDailyProgress = {
          lastResetDate: today,
          notifications: [],
        };
        store.set('dailyProgress', newDailyProgress);
        return newDailyProgress;
      }

      return dailyProgress;
    },
  );

  ipcMain.handle(
    'toggle-notification-completion',
    (
      _,
      payload: HandlerPayload<'toggle-notification-completion'>,
    ): HandlerReturn<'toggle-notification-completion'> => {
      const dailyProgress = store.get('dailyProgress');

      const updatedNotifications = dailyProgress.notifications.map(
        (notification) => {
          if (notification.id === payload) {
            return {
              ...notification,
              completed: !notification.completed,
            };
          }
          return notification;
        },
      );

      const updatedProgress = {
        ...dailyProgress,
        notifications: updatedNotifications,
      };

      store.set('dailyProgress', updatedProgress);
      return updatedProgress;
    },
  );
};
