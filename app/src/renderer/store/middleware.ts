import { Middleware, isRejectedWithValue } from '@reduxjs/toolkit';
import { enqueueSnackbar } from 'notistack';

const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    enqueueSnackbar(
      'data' in action.error
        ? (action.error.data as { message: string }).message
        : action.error.message,
      { variant: 'error' },
    );
  }

  return next(action);
};

export default rtkQueryErrorLogger;
