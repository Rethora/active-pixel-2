import { ipcMain } from 'electron';
import dayjs from 'dayjs';
import store from '../store';

export default () => {
  ipcMain.on('get-daily-progress', async (event) => {
    const dailyProgress = store.get('dailyProgress');

    // Check if we need to reset for a new day
    const today = dayjs().format('YYYY-MM-DD');
    if (dailyProgress.lastResetDate !== today) {
      const newDailyProgress = {
        lastResetDate: today,
        notifications: [],
      };
      store.set('dailyProgress', newDailyProgress);
      event.returnValue = newDailyProgress;
    } else {
      event.returnValue = dailyProgress;
    }
  });

  ipcMain.on(
    'toggle-notification-completion',
    async (event, notificationId: string) => {
      const dailyProgress = store.get('dailyProgress');

      const updatedNotifications = dailyProgress.notifications.map(
        (notification) => {
          if (notification.id === notificationId) {
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
      event.returnValue = updatedProgress;
    },
  );
};
