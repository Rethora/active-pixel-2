import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import electronBaseQuery from '../store/baseQueries';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';
import { Suggestion, SuggestionFilters } from '../../shared/types/suggestion';

export interface SuggestionWithFeedback extends Suggestion {
  feedback: number;
}

interface SuggestionsState {
  previousSuggestionIds: string[];
  currentSuggestionId: string | null;
  currentFilters: SuggestionFilters;
}

const initialState: SuggestionsState = {
  previousSuggestionIds: [],
  currentSuggestionId: null,
  currentFilters: {},
};

// RTK Query API definition
export const suggestionsApi = createApi({
  reducerPath: 'suggestionsApi',
  baseQuery: electronBaseQuery,
  tagTypes: ['Suggestions'],
  endpoints: (builder) => ({
    getAllSuggestionsWithAddProps: builder.query<
      HandlerReturn<'get-all-suggestions-with-add-props'>,
      void
    >({
      query: () => ({ channel: 'get-all-suggestions-with-add-props' }),
      providesTags: ['Suggestions'],
    }),
    getSuggestionWithAddPropsById: builder.query<
      HandlerReturn<'get-suggestion-with-add-props-by-id'>,
      HandlerPayload<'get-suggestion-with-add-props-by-id'>
    >({
      query: (id) => ({
        channel: 'get-suggestion-with-add-props-by-id',
        payload: id,
      }),
      providesTags: ['Suggestions'],
    }),
    addLikedSuggestion: builder.mutation<
      HandlerReturn<'add-liked-suggestion'>,
      HandlerPayload<'add-liked-suggestion'>
    >({
      query: (id) => ({ channel: 'add-liked-suggestion', payload: id }),
      invalidatesTags: ['Suggestions'],
    }),
    addDislikedSuggestion: builder.mutation<
      HandlerReturn<'add-disliked-suggestion'>,
      HandlerPayload<'add-disliked-suggestion'>
    >({
      query: (id) => ({ channel: 'add-disliked-suggestion', payload: id }),
      invalidatesTags: ['Suggestions'],
    }),
    removeFeedback: builder.mutation<
      HandlerReturn<'remove-feedback'>,
      HandlerPayload<'remove-feedback'>
    >({
      query: (id) => ({ channel: 'remove-feedback', payload: id }),
      invalidatesTags: ['Suggestions'],
    }),
  }),
});

// Create the suggestions slice for regular reducers
export const suggestionsSlice = createSlice({
  name: 'suggestions',
  initialState,
  reducers: {
    setCurrentSuggestionId: (state, action: PayloadAction<string>) => {
      state.currentSuggestionId = action.payload;
    },
    setCurrentFilters: (state, action: PayloadAction<SuggestionFilters>) => {
      state.currentFilters = action.payload;
    },
    clearCurrentSuggestion: (state) => {
      state.currentSuggestionId = null;
      state.currentFilters = {};
    },
    addPreviousSuggestionId: (state, action: PayloadAction<string>) => {
      if (state.previousSuggestionIds.includes(action.payload)) {
        return;
      }
      if (state.previousSuggestionIds.length >= 10) {
        state.previousSuggestionIds.shift();
      }
      state.previousSuggestionIds.push(action.payload);
    },
  },
});

export const {
  setCurrentSuggestionId,
  setCurrentFilters,
  clearCurrentSuggestion,
  addPreviousSuggestionId,
} = suggestionsSlice.actions;

// Export hooks from RTK Query
export const {
  useGetAllSuggestionsWithAddPropsQuery,
  useGetSuggestionWithAddPropsByIdQuery,
  useAddLikedSuggestionMutation,
  useAddDislikedSuggestionMutation,
  useRemoveFeedbackMutation,
} = suggestionsApi;

// Export the reducer
export default suggestionsSlice.reducer;
