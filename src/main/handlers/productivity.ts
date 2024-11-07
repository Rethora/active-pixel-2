import { ipcMain } from 'electron';
import {
  getCurrentProductivity,
  getProductivityHistory,
} from '../activity/monitor';
import { HandlerReturn } from '../../shared/types/ipc';

export default () => {
  ipcMain.handle(
    'get-current-productivity',
    (): HandlerReturn<'get-current-productivity'> => {
      return getCurrentProductivity();
    },
  );

  ipcMain.handle(
    'get-productivity-history',
    (): HandlerReturn<'get-productivity-history'> => {
      return getProductivityHistory();
    },
  );
};
