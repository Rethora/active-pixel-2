import { configureStore } from '@reduxjs/toolkit';
import rtkQueryErrorLogger from './middleware';
import { settingsApi } from '../slices/settingsSlice';
import { schedulesApi } from '../slices/schedulesSlice';
import suggestionsReducer, { suggestionsApi } from '../slices/suggestionsSlice';

export const store = configureStore({
  reducer: {
    suggestions: suggestionsReducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [schedulesApi.reducerPath]: schedulesApi.reducer,
    [suggestionsApi.reducerPath]: suggestionsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(settingsApi.middleware)
      .concat(schedulesApi.middleware)
      .concat(suggestionsApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;