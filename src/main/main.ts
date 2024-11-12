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
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util/path';
import showBackgroundNotification from './notifications/notificationTypes/background';
import showMainWindow from './util/window';
import handleSettings from './settings/util';
import { handleSchedules } from './schedule/util';
import { getState, setState } from './state';
import store from './store';
import registerScheduleHandlers from './handlers/schedule';
import registerSettingsHandlers from './handlers/settings';
import registerSuggestionHandlers from './handlers/suggestion';
import registerDailyProgressHandlers from './handlers/progress';
import registerDoNotDisturbSchedulesHandlers from './handlers/doNotDisturbSchedules';
import registerProductivityHandlers from './handlers/productivity';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}
const { showWindowOnStartup, runInBackground } = store.get('settings');

setState({
  showWindowOnStartup,
  runInBackground,
});

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
  const extensions = ['REDUX_DEVTOOLS', 'REACT_DEVELOPER_TOOLS'];

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

const createTray = () => {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const tray = new Tray(getAssetPath('icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        showMainWindow(getState().mainWindow);
      },
    },
    {
      label: 'Quit',
      click: () => {
        setState({
          isAppQuitting: true,
        });
        app.quit();
      },
    },
  ]);
  tray.on('click', () => {
    showMainWindow(getState().mainWindow);
  });
  tray.setToolTip('Active Pixel');
  tray.setContextMenu(contextMenu);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  const window = new BrowserWindow({
    show: false,
    width: 1920,
    height: 1080,
    minWidth: 760,
    minHeight: 500,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  window.loadURL(resolveHtmlPath('index.html'));

  window.on('ready-to-show', () => {
    if (!window) {
      throw new Error('"mainWindow" is not defined');
    }
    if (getState().runInBackground && !getState().showWindowOnStartup) {
      showBackgroundNotification(window);
      return;
    }
    window.show();
  });

  window.on('close', (event) => {
    const { isAppQuitting } = getState();
    if (!isAppQuitting) {
      if (!getState().runInBackground) {
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
  .then(() => {
    const settings = store.get('settings');

    handleSettings(settings);
    handleSchedules();

    registerSettingsHandlers();
    registerScheduleHandlers();
    registerSuggestionHandlers();
    registerDailyProgressHandlers();
    registerDoNotDisturbSchedulesHandlers();
    registerProductivityHandlers();
    createWindow();
    createTray();
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
