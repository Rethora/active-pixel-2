import { ipcMain } from 'electron';
import handleSettings from './util';
import store from '../store';
import { HandlerPayload } from '../../shared/types/ipc';

export default () => {
  ipcMain.handle('get-settings', async () => {
    const settings = store.get('settings');
    return settings;
  });

  ipcMain.handle(
    'update-settings',
    async (_, payload: HandlerPayload<'update-settings'>) => {
      const { ...settings } = payload;
      store.set('settings', payload);
      handleSettings(settings);
      return payload;
    },
  );
};
