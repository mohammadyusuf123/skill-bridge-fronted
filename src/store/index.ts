import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import tutorReducer from './slices/tutorSlice';
import bookingReducer from './slices/bookingSlice';
import uiReducer from './slices/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tutor: tutorReducer,
      booking: bookingReducer,
      ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
