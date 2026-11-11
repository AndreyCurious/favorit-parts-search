import { configureStore } from '@reduxjs/toolkit';
import { partsApi, searchReducer } from '../modules/parts-search/state';

export const createAppStore = () =>
  configureStore({
    reducer: { search: searchReducer, [partsApi.reducerPath]: partsApi.reducer },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(partsApi.middleware),
  });
