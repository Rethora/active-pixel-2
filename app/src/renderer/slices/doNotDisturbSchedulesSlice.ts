import { createApi } from '@reduxjs/toolkit/query/react';
import electronBaseQuery from '../store/baseQueries';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';

export const doNotDisturbSchedulesApi = createApi({
  reducerPath: 'doNotDisturbSchedulesApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['DoNotDisturbSchedules'],
  endpoints: (builder) => ({
    getDoNotDisturbSchedules: builder.query<
      HandlerReturn<'get-do-not-disturb-schedules'>,
      void
    >({
      query: () => ({ channel: 'get-do-not-disturb-schedules' }),
      providesTags: ['DoNotDisturbSchedules'],
    }),
    getDoNotDisturbSchedule: builder.query<
      HandlerReturn<'get-do-not-disturb-schedule'>,
      HandlerPayload<'get-do-not-disturb-schedule'>
    >({
      query: (payload) => ({
        channel: 'get-do-not-disturb-schedule',
        payload,
      }),
      providesTags: ['DoNotDisturbSchedules'],
    }),
    addDoNotDisturbSchedule: builder.mutation<
      HandlerReturn<'add-do-not-disturb-schedule'>,
      HandlerPayload<'add-do-not-disturb-schedule'>
    >({
      query: (schedule) => ({
        channel: 'add-do-not-disturb-schedule',
        payload: schedule,
      }),
      invalidatesTags: ['DoNotDisturbSchedules'],
    }),
    updateDoNotDisturbSchedule: builder.mutation<
      HandlerReturn<'update-do-not-disturb-schedule'>,
      HandlerPayload<'update-do-not-disturb-schedule'>
    >({
      query: (schedule) => ({
        channel: 'update-do-not-disturb-schedule',
        payload: schedule,
      }),
      invalidatesTags: ['DoNotDisturbSchedules'],
    }),
    deleteDoNotDisturbSchedule: builder.mutation<
      HandlerReturn<'delete-do-not-disturb-schedule'>,
      HandlerPayload<'delete-do-not-disturb-schedule'>
    >({
      query: (id) => ({
        channel: 'delete-do-not-disturb-schedule',
        payload: id,
      }),
      invalidatesTags: ['DoNotDisturbSchedules'],
    }),
  }),
});

export const {
  useGetDoNotDisturbSchedulesQuery,
  useGetDoNotDisturbScheduleQuery,
  useAddDoNotDisturbScheduleMutation,
  useUpdateDoNotDisturbScheduleMutation,
  useDeleteDoNotDisturbScheduleMutation,
} = doNotDisturbSchedulesApi;
