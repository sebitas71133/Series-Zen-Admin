import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../config/supabaseClient";

export const seriesApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (builder) => ({
    fetchSeries: builder.query({
      queryFn: async () => {
        try {
          const { data, error } = await supabase.from("SERIES").select("*");
          if (error) throw error;
          return { data, error };
        } catch (error) {
          return { data: null, error: error.message };
        }
      },
      providesTags: ["Series"], // Proporciona la etiqueta 'Series'
    }),
    addSerie: builder.mutation({
      queryFn: async (newSerie) => {
        try {
          const { data, error } = await supabase
            .from("SERIES")
            .insert([newSerie])
            .select();
          console.log({ data, error });

          if (error) throw error;
          return { data, error };
        } catch (error) {
          return { data: null, error: error.message };
        }
      },
      invalidatesTags: ["Series"], // Invalida la etiqueta 'Series'
    }),
  }),
});

export const { useFetchSeriesQuery, useAddSerieMutation } = seriesApi;
