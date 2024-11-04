import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
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
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
