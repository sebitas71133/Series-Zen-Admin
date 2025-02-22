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
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Series"], // Proporciona la etiqueta 'Series'
    }),

    fetchSerieById: builder.query({
      queryFn: async (serieId) => {
        try {
          const { data, error } = await supabase
            .from("SERIES")
            .select("*")
            .eq("id", serieId);
          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
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
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Series"], // Invalida la etiqueta 'Series'
    }),

    updateSerie: builder.mutation({
      queryFn: async ({ id, ...updatedSerie }) => {
        try {
          const { data, error } = await supabase
            .from("SERIES")
            .update(updatedSerie)
            .eq("id", id)
            .select();

          console.log({ data, error });

          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Series"], // Invalida la etiqueta 'Series'
    }),

    deleteSerie: builder.mutation({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from("SERIES")
            .delete()
            .eq("id", id)
            .select();

          console.log({ data, error });

          // if (error) throw error;

          if (!data || data.length === 0) {
            throw new Error(
              "No tienes permisos para eliminar esta serie o la serie no existe."
            );
          }

          return { data, error };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Series"], // Invalida la etiqueta 'Series'
    }),
  }),
});

export const {
  useFetchSeriesQuery,
  useAddSerieMutation,
  useUpdateSerieMutation,
  useDeleteSerieMutation,
  useFetchSerieByIdQuery,
} = seriesApi;
