import { BrowserWindow } from 'electron';
import nodeSchedule from 'node-schedule';

// ! runInBackground and showWindowOnStartup can now be accessed directly from the store
// TODO: remove runInBackground and showWindowOnStartup from state and replace all occurrences with store.get('settings')
interface State {
  showWindowOnStartup: boolean;
  runInBackground: boolean;
  isAppQuitting: boolean;
  mainWindow: BrowserWindow | null;
  scheduledJobs: Record<string, nodeSchedule.Job>;
}

const state: State = {
  showWindowOnStartup: true,
  runInBackground: false,
  isAppQuitting: false,
  mainWindow: null,
  scheduledJobs: {},
};

export const setState = (newState: Partial<State>) => {
  Object.assign(state, newState);
};

export const getState = () => state;
