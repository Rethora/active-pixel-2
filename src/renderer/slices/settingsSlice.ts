import { createApi } from '@reduxjs/toolkit/query/react';

import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';
import electronBaseQuery from '../store/baseQueries';

export const settingsApi = createApi({
  reducerPath: 'settingsApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['Settings'],
  endpoints: (builder) => ({
    getSettings: builder.query<HandlerReturn<'get-settings'>, void>({
      query: () => ({
        channel: 'get-settings',
      }),
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<
      HandlerReturn<'update-settings'>,
      HandlerPayload<'update-settings'>
    >({
      query: (settings) => ({
        channel: 'update-settings',
        payload: settings,
      }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const { useGetSettingsQuery, useUpdateSettingsMutation } = settingsApi;
