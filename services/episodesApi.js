import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { supabase } from "../config/supabaseClient";

export const episodesApi = createApi({
  reducerPath: "episodesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),

  endpoints: (builder) => ({
    fetchEpisodes: builder.query({
      queryFn: async (seasonId) => {
        try {
          const { data, error } = await supabase
            .from("EPISODES")
            .select("*")
            .eq("season_id", seasonId)
            .order("episode_number", { ascending: true });
          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      providesTags: ["Episodes"],
    }),
    addEpisode: builder.mutation({
      queryFn: async (newEpisode) => {
        try {
          const { data, error } = await supabase
            .from("EPISODES")
            .insert([newEpisode])
            .select();
          console.log({ data, error });

          if (error) throw error;
          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Episodes"],
    }),
    updateEpisode: builder.mutation({
      queryFn: async ({ id, ...updatedEpisode }) => {
        try {
          const { data, error } = await supabase
            .from("EPISODES")
            .update(updatedEpisode)
            .eq("id", id)
            .select();

          console.log({ data, error });

          if (error) throw error;

          return { data };
        } catch (error) {
          return { error: { message: error.message } };
        }
      },
      invalidatesTags: ["Episodes"],
    }),

    deleteEpisode: builder.mutation({
      queryFn: async (id) => {
        try {
          const { data, error } = await supabase
            .from("EPISODES")
            .delete()
            .eq("id", id)
            .select();

          console.log({ data, error });

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
      invalidatesTags: ["Episodes"],
    }),
  }),
});

export const {
  useFetchEpisodesQuery,
  useAddEpisodeMutation,
  useUpdateEpisodeMutation,
  useDeleteEpisodeMutation,
} = episodesApi;
