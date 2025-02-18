import { configureStore } from "@reduxjs/toolkit";
import { seriesApi } from "../services/seriesApi";
import { sessionReducer } from "./sessionSlice";
import { temporadasApi } from "../services/temporadasApi";
import { episodesApi } from "../services/episodesApi";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [seriesApi.reducerPath]: seriesApi.reducer,
    [temporadasApi.reducerPath]: temporadasApi.reducer,
    [episodesApi.reducerPath]: episodesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(seriesApi.middleware)
      .concat(temporadasApi.middleware)
      .concat(episodesApi.middleware),
});
