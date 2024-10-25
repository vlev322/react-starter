import { configureStore } from '@reduxjs/toolkit';

import { starWarsApiSlice } from './starWars/starWarsApiSlice';

export const store = configureStore({
  reducer: {
    [starWarsApiSlice.reducerPath]: starWarsApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(starWarsApiSlice.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
