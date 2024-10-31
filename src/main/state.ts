import { BrowserWindow } from 'electron';
import nodeSchedule from 'node-schedule';

interface State {
  silenceNotifications: boolean;
  showWindowOnStartup: boolean;
  runInBackground: boolean;
  isAppQuitting: boolean;
  mainWindow: BrowserWindow | null;
  scheduledJobs: Record<string, nodeSchedule.Job>;
}

const state: State = {
  silenceNotifications: false,
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
