import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import {
  DailyProgress,
  PartialScheduleWithoutId,
  Schedule,
  ScheduleWithoutId,
} from '../shared/types/schedule';
import { Suggestion, SuggestionFilters } from '../shared/types/suggestion';
import {
  HandlerPayload,
  HandlerReturn,
  IpcChannels,
} from '../shared/types/ipc';

// Define the channel configuration type that maps channels to their request/response types

const electronHandler = {
  ipcRenderer: {
    sendMessage: <T extends IpcChannels>(
      channel: T,
      payload: HandlerPayload<T>,
    ) => {
      ipcRenderer.send(channel, payload);
    },
    invoke: async <T extends IpcChannels>(
      channel: T,
      payload?: HandlerPayload<T>,
    ): Promise<HandlerReturn<T>> => {
      return ipcRenderer.invoke(channel, payload);
    },
    on: <T extends IpcChannels>(
      channel: T,
      callback: (payload: HandlerPayload<T>) => void,
    ) => {
      const subscription = (
        _event: IpcRendererEvent,
        payload: HandlerPayload<T>,
      ) => callback(payload);
      ipcRenderer.on(channel, subscription);
      return () => ipcRenderer.removeListener(channel, subscription);
    },
    // Legacy handlers - to be removed gradually
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
    getDailyProgress(): Promise<DailyProgress> {
      return ipcRenderer.sendSync('get-daily-progress');
    },
    toggleNotificationCompletion(
      notificationId: string,
    ): Promise<DailyProgress> {
      return ipcRenderer.sendSync(
        'toggle-notification-completion',
        notificationId,
      );
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
