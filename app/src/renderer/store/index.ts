import { configureStore } from '@reduxjs/toolkit';
import rtkQueryErrorLogger from './middleware';
import { settingsApi } from '../slices/settingsSlice';
import { schedulesApi } from '../slices/schedulesSlice';
import suggestionsReducer, { suggestionsApi } from '../slices/suggestionsSlice';
import { dailyProgressApi } from '../slices/progressSlice';
import { doNotDisturbSchedulesApi } from '../slices/doNotDisturbSchedulesSlice';
import { productivityApi } from '../slices/productivitySlice';

export const store = configureStore({
  reducer: {
    suggestions: suggestionsReducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    [schedulesApi.reducerPath]: schedulesApi.reducer,
    [suggestionsApi.reducerPath]: suggestionsApi.reducer,
    [dailyProgressApi.reducerPath]: dailyProgressApi.reducer,
    [doNotDisturbSchedulesApi.reducerPath]: doNotDisturbSchedulesApi.reducer,
    [productivityApi.reducerPath]: productivityApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(settingsApi.middleware)
      .concat(schedulesApi.middleware)
      .concat(suggestionsApi.middleware)
      .concat(dailyProgressApi.middleware)
      .concat(doNotDisturbSchedulesApi.middleware)
      .concat(productivityApi.middleware)
      .concat(rtkQueryErrorLogger),
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
