import { configureStore } from "@reduxjs/toolkit";
import { seriesApi } from "../services/seriesApi";
import { sessionReducer } from "./sessionSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    [seriesApi.reducerPath]: seriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(seriesApi.middleware),
});
