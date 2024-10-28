// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { Settings } from '../shared/types/settings';
import { Schedule } from '../shared/types/schedule';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  store: {
    getSettings() {
      return ipcRenderer.sendSync('get-settings');
    },
    setSettings(settings: Settings) {
      ipcRenderer.send('set-settings', settings);
    },
    getSchedules() {
      return ipcRenderer.sendSync('get-schedules');
    },
    addSchedule(schedule: Schedule) {
      ipcRenderer.send('add-schedule', schedule);
    },
    updateSchedule(scheduleId: string, schedule: Omit<Schedule, 'id'>) {
      ipcRenderer.send('update-schedule', scheduleId, schedule);
    },
    deleteSchedule(id: string) {
      ipcRenderer.send('delete-schedule', id);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
