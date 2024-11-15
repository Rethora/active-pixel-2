import { ipcMain } from 'electron';
import handleSettings from '../settings/util';
import store from '../store';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';

export default () => {
  ipcMain.handle('get-settings', (): HandlerReturn<'get-settings'> => {
    const settings = store.get('settings');
    return settings;
  });

  ipcMain.handle(
    'update-settings',
    (
      _,
      payload: HandlerPayload<'update-settings'>,
    ): HandlerReturn<'update-settings'> => {
      const settings = store.get('settings');
      const updatedSettings = { ...settings, ...payload };
      store.set('settings', updatedSettings);
      handleSettings(payload);
      return updatedSettings;
    },
  );
};
