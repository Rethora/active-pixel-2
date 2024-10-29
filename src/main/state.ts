import { BrowserWindow } from 'electron';

interface State {
  showWindowOnStartup: boolean;
  runInBackground: boolean;
  isAppQuitting: boolean;
  mainWindow: BrowserWindow | null;
}

const state: State = {
  showWindowOnStartup: true,
  runInBackground: false,
  isAppQuitting: false,
  mainWindow: null,
};

export const setState = (newState: Partial<State>) => {
  Object.assign(state, newState);
};

export const getState = () => state;
