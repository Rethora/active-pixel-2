import { BrowserWindow } from 'electron';

export default (mainWindow: BrowserWindow | undefined) => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    if (mainWindow.isVisible()) {
      mainWindow.focus();
    } else {
      mainWindow.show();
    }
  }
};
