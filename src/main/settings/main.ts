import { ipcMain, IpcMainEvent } from 'electron';
import handleSettings from './util';
import storePromise from '../store';
import { PartialSettings, Settings } from '../../shared/types/settings';

ipcMain.on('get-settings', async (event: IpcMainEvent) => {
  const store = await storePromise;
  const settings = (await store.get('settings')) as Settings;
  event.returnValue = settings;
});

ipcMain.on(
  'update-settings',
  async (event: IpcMainEvent, updatedSettings: PartialSettings) => {
    const { ...settings } = updatedSettings;
    console.log('update-settings', updatedSettings);
    const store = await storePromise;
    store.set('settings', updatedSettings);
    handleSettings(settings);
    event.returnValue = updatedSettings;
  },
);
