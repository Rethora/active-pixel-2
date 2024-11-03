import { createApi } from '@reduxjs/toolkit/query/react';

import {
  HandlerArgs,
  HandlerReturn,
  IpcChannels,
} from '../../shared/types/ipc';

// Custom base query for Electron IPC communication
const electronBaseQuery = async <T extends IpcChannels>({
  channel,
  args,
}: {
  channel: T;
  args?: HandlerArgs<T>;
}) => {
  try {
    const result = await window.electron.ipcRenderer.invoke(channel, args);
    return { data: result };
  } catch (error) {
    return { error: { status: 'CUSTOM_ERROR', data: error } };
  }
};

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getTest: builder.query<HandlerReturn<'test'>, void>({
      query: () => ({
        channel: 'test',
      }),
    }),
    getSettings: builder.query({
      query: () => ({
        channel: 'test',
      }),
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation({
      query: (settings) => ({
        channel: 'update-settings',
        args: [settings],
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetTestQuery } = settingsApi;
