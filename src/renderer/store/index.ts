import { configureStore } from '@reduxjs/toolkit';
import { settingsApi } from '../slices/settingsSlice';
import rtkQueryErrorLogger from './middleware';

export const store = configureStore({
  reducer: {
    [settingsApi.reducerPath]: settingsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(settingsApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
