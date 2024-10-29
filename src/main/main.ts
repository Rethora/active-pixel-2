/* eslint global-require: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { getAssetPath, resolveHtmlPath } from './util/path';
import settingsPromise from './settings/storeHelpers';
import showBackgroundNotification from './notifications/background';
import showMainWindow from './util/window';
import handleSettings from './settings/util';
import { getState, setState } from './state';
// Ipc Main Handlers
import './schedule/main';
import './settings/main';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

(async () => {
  const { getSettings } = await settingsPromise;
  const { showWindowOnStartup, runInBackground } = await getSettings();
  setState({
    showWindowOnStartup,
    runInBackground,
  });
})();

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return (
    installer
      .default(
        extensions.map((name) => installer[name]),
        forceDownload,
      )
      // eslint-disable-next-line no-console
      .catch(console.error)
  );
};

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('Got the lock, quitting app');
  setState({
    isAppQuitting: true,
  });
  app.quit();
} else {
  app.on('second-instance', () => {
    const { mainWindow } = getState();
    if (mainWindow) {
      showMainWindow(mainWindow);
    }
  });
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const window = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  window.loadURL(resolveHtmlPath('index.html'));

  window.on('ready-to-show', () => {
    const { runInBackground, showWindowOnStartup } = getState();
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (runInBackground && !showWindowOnStartup) {
      showBackgroundNotification(window);
      return;
    }
    window.show();
  });

  window.on('close', (event) => {
    const { isAppQuitting, runInBackground } = getState();
    if (!isAppQuitting) {
      if (!runInBackground) {
        console.log('Quitting app');
        setState({
          isAppQuitting: true,
        });
        app.quit();
      } else if (window) {
        showBackgroundNotification(window);
        event.preventDefault();
        window.hide();
      }
    } else {
      console.log('Quitting app');
      app.quit();
    }
  });

  const menuBuilder = new MenuBuilder(window);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  window.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();

  setState({
    mainWindow: window,
  });
};

app
  .whenReady()
  .then(async () => {
    const { getSettings } = await settingsPromise;
    const settings = await getSettings();

    handleSettings(settings);

    createWindow();

    app.on('activate', () => {
      const { mainWindow } = getState();
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  // eslint-disable-next-line no-console
  .catch(console.error);

ipcMain.handle('quit-app', () => {
  setState({
    isAppQuitting: true,
  });
  app.quit();
});
