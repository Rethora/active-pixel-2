import { ipcMain } from 'electron';
import storeHelpersPromise from './storeHelpers';

(async () => {
  const { getSettings, setSettings } = await storeHelpersPromise;

  ipcMain.on('get-settings', async (event) => {
    event.returnValue = await getSettings();
  });

  ipcMain.on('set-settings', async (event, settings) => {
    await setSettings(settings);
  });
})();
