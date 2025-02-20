import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../config/supabaseClient";

export const temporadasApi = createApi({
  reducerPath: "temporadasApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),

  endpoints: (builder) => ({
    fetchTemporadas: builder.query({
      queryFn: async (serieId) => {
        try {
          const { data, error } = await supabase
            .from("SEASON")
            .select("*")
            .eq("series_id", serieId)
            .order("season_number", { ascending: true });
          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Temporadas"],
    }),

    addTemporada: builder.mutation({
      queryFn: async (newTemporada) => {
        try {
          const { data, error } = await supabase
            .from("SEASON")
            .insert([newTemporada])
            .select();
          console.log({ data, error });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Temporadas"],
    }),
    updateTemporada: builder.mutation({
      queryFn: async ({ id, ...updatedTemporada }) => {
        try {
          const { data, error } = await supabase
            .from("SEASON")
            .update(updatedTemporada)
            .eq("id", id)
            .select();

          console.log({ data, error });

          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Temporadas"],
    }),

    deleteTemporada: builder.mutation({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from("SEASON")
            .delete()
            .eq("id", id)
            .select();

          console.log({ data, error });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Temporadas"],
    }),
  }),
});

export const {
  useAddTemporadaMutation,
  useFetchTemporadasQuery,
  useDeleteTemporadaMutation,
  useUpdateTemporadaMutation,
} = temporadasApi;
