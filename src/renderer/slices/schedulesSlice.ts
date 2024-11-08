import { createApi } from '@reduxjs/toolkit/query/react';
import electronBaseQuery from '../store/baseQueries';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';

export const schedulesApi = createApi({
  reducerPath: 'schedulesApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['Schedules'],
  endpoints: (builder) => ({
    getSchedules: builder.query<HandlerReturn<'get-schedules'>, void>({
      query: () => ({ channel: 'get-schedules' }),
      providesTags: ['Schedules'],
    }),
    getSchedule: builder.query<HandlerReturn<'get-schedule'>, string>({
      query: (id) => ({ channel: 'get-schedule', payload: id }),
      providesTags: ['Schedules'],
    }),
    addSchedule: builder.mutation<
      HandlerReturn<'add-schedule'>,
      HandlerPayload<'add-schedule'>
    >({
      query: (schedule) => ({ channel: 'add-schedule', payload: schedule }),
      invalidatesTags: ['Schedules'],
    }),
    updateSchedule: builder.mutation<
      HandlerReturn<'update-schedule'>,
      HandlerPayload<'update-schedule'>
    >({
      query: (schedule) => ({ channel: 'update-schedule', payload: schedule }),
      invalidatesTags: ['Schedules'],
    }),
    deleteSchedule: builder.mutation<
      HandlerReturn<'delete-schedule'>,
      HandlerPayload<'delete-schedule'>
    >({
      query: (id) => ({ channel: 'delete-schedule', payload: id }),
      invalidatesTags: ['Schedules'],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useGetScheduleQuery,
  useAddScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} = schedulesApi;
