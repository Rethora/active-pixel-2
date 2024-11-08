import { createApi } from '@reduxjs/toolkit/query/react';
import electronBaseQuery from '../store/baseQueries';
import { HandlerReturn } from '../../shared/types/ipc';

export const productivityApi = createApi({
  reducerPath: 'productivityApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['Productivity', 'ProductivityHistory'],
  endpoints: (builder) => ({
    getCurrentProductivity: builder.query<
      HandlerReturn<'get-current-productivity'>,
      void
    >({
      query: () => ({ channel: 'get-current-productivity' }),
      providesTags: ['Productivity'],
    }),
    getProductivityHistory: builder.query<
      HandlerReturn<'get-productivity-history'>,
      void
    >({
      query: () => ({ channel: 'get-productivity-history' }),
      providesTags: ['ProductivityHistory'],
    }),
  }),
});

export const {
  useGetCurrentProductivityQuery,
  useGetProductivityHistoryQuery,
} = productivityApi;
