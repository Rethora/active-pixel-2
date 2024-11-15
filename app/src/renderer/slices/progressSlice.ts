import { createApi } from '@reduxjs/toolkit/query/react';
import electronBaseQuery from '../store/baseQueries';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';

export const dailyProgressApi = createApi({
  reducerPath: 'dailyProgressApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['DailyProgress'],
  endpoints: (builder) => ({
    getDailyProgress: builder.query<HandlerReturn<'get-daily-progress'>, void>({
      query: () => ({ channel: 'get-daily-progress' }),
      providesTags: ['DailyProgress'],
    }),
    toggleNotificationCompletion: builder.mutation<
      HandlerReturn<'toggle-notification-completion'>,
      HandlerPayload<'toggle-notification-completion'>
    >({
      query: (notificationId) => ({
        channel: 'toggle-notification-completion',
        payload: notificationId,
      }),
      invalidatesTags: ['DailyProgress'],
    }),
  }),
});

export const {
  useGetDailyProgressQuery,
  useToggleNotificationCompletionMutation,
} = dailyProgressApi;
