// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { PartialSettings, Settings } from '../shared/types/settings';
import {
  PartialScheduleWithoutId,
  Schedule,
  ScheduleWithoutId,
} from '../shared/types/schedule';
import { Suggestion, SuggestionFilters } from '../shared/types/suggestion';

export type Channels = 'suggestion-notification';

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
    onSuggestionNotification(
      callback: (suggestion: Suggestion, filters: SuggestionFilters) => void,
    ) {
      return ipcRenderer.on(
        'suggestion-notification',
        (_, suggestion, filters) => callback(suggestion, filters),
      );
    },
    quitApp() {
      ipcRenderer.invoke('quit-app');
    },
  },
  store: {
    getSettings(): Promise<Settings> {
      return ipcRenderer.sendSync('get-settings');
    },
    updateSettings(settings: PartialSettings): Promise<PartialSettings> {
      return ipcRenderer.sendSync('update-settings', settings);
    },
    getSchedules(): Promise<Schedule[]> {
      return ipcRenderer.sendSync('get-schedules');
    },
    getSchedule(id: string): Promise<Schedule | undefined> {
      return ipcRenderer.sendSync('get-schedule', id);
    },
    addSchedule(schedule: ScheduleWithoutId): Promise<Schedule> {
      return ipcRenderer.sendSync('add-schedule', schedule);
    },
    updateSchedule(
      scheduleId: string,
      schedule: PartialScheduleWithoutId,
    ): Promise<Schedule> {
      return ipcRenderer.sendSync('update-schedule', scheduleId, schedule);
    },
    deleteSchedule(id: string): Promise<string> {
      return ipcRenderer.sendSync('delete-schedule', id);
    },
    getLikedSuggestions(): Promise<string[]> {
      return ipcRenderer.sendSync('get-liked-suggestions');
    },
    getDislikedSuggestions(): Promise<string[]> {
      return ipcRenderer.sendSync('get-disliked-suggestions');
    },
    addLikedSuggestion(id: string): Promise<string[]> {
      return ipcRenderer.sendSync('add-liked-suggestion', id);
    },
    removeLikedSuggestion(id: string): Promise<string[]> {
      return ipcRenderer.sendSync('remove-liked-suggestion', id);
    },
    addDislikedSuggestion(id: string): Promise<string[]> {
      return ipcRenderer.sendSync('add-disliked-suggestion', id);
    },
    removeDislikedSuggestion(id: string): Promise<string[]> {
      return ipcRenderer.sendSync('remove-disliked-suggestion', id);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
