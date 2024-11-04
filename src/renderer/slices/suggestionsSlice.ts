import { createApi } from '@reduxjs/toolkit/query/react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import electronBaseQuery from '../store/baseQueries';
import { HandlerPayload, HandlerReturn } from '../../shared/types/ipc';
import { Suggestion } from '../../shared/types/suggestion';

export interface SuggestionWithFeedback extends Suggestion {
  feedback: number;
}

interface SuggestionsState {
  selectedSuggestion: SuggestionWithFeedback | null;
  filteredSuggestions: SuggestionWithFeedback[];
  filters: {
    force?: string[];
    level?: string[];
    mechanic?: string[];
    equipment?: string[];
    primaryMuscles?: string[];
    secondaryMuscles?: string[];
    category?: string[];
  };
}

const initialState: SuggestionsState = {
  selectedSuggestion: null,
  filteredSuggestions: [],
  filters: {},
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
    setSelectedSuggestion: (
      state,
      action: PayloadAction<SuggestionWithFeedback | null>,
    ) => {
      state.selectedSuggestion = action.payload;
    },
    setFilteredSuggestions: (
      state,
      action: PayloadAction<SuggestionWithFeedback[]>,
    ) => {
      state.filteredSuggestions = action.payload;
    },
    updateFilters: (
      state,
      action: PayloadAction<Partial<SuggestionsState['filters']>>,
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredSuggestions = [];
    },
    getRandomSuggestion: (state) => {
      const randomIndex = Math.floor(
        Math.random() * state.filteredSuggestions.length,
      );
      state.selectedSuggestion = state.filteredSuggestions[randomIndex];
    },
  },
});

// Export actions from the slice
export const {
  setSelectedSuggestion,
  setFilteredSuggestions,
  updateFilters,
  clearFilters,
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
