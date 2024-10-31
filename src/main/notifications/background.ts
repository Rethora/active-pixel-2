import { BrowserWindow, Notification } from 'electron';
import showMainWindow from '../util/window';
import handleNotification from './util/handleNotification';

export default (mainWindow: BrowserWindow) => {
  const notification = new Notification({
    title: 'Active Pixel is running in the background',
    body: 'You can quit the app by clicking the quit button in the app or by quitting from the system tray',
  });

  notification.on('click', () => {
    showMainWindow(mainWindow);
  });

  handleNotification(notification, true);
};
