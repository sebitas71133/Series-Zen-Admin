import { supabase } from "../../config/supabaseClient";
import { deleteImageFromStorage } from "./imageUtils";

const deleteSeriesWithImages = async (serieId) => {
  try {
    // 1️⃣ Obtener imágenes de la serie
    const { data: serie, error: serieError } = await supabase
      .from("SERIES")
      .select("cover_image, banner_image")
      .eq("id", serieId)
      .single();

    if (serieError) throw serieError;

    // 2️⃣ Obtener imágenes de las temporadas
    const { data: temporadas, error: temporadasError } = await supabase
      .from("SEASON")
      .select("id, poster_image")
      .eq("series_id", serieId);

    if (temporadasError) throw temporadasError;

    // 3️⃣ Obtener imágenes de episodios de todas las temporadas
    const { data: episodios, error: episodiosError } = await supabase
      .from("EPISODES")
      .select("thumbnail_image")
      .in(
        "season_id",
        temporadas.map((t) => t.id)
      );

    if (episodiosError) throw episodiosError;

    // 4️⃣ Eliminar imágenes en paralelo
    const deletePromises = [
      ...(serie?.cover_image
        ? [deleteImageFromStorage(serie.cover_image)]
        : []),
      ...(serie?.banner_image
        ? [deleteImageFromStorage(serie.banner_image)]
        : []),
      ...temporadas
        .filter((t) => t?.poster_image)
        .map((t) => deleteImageFromStorage(t.poster_image)),
      ...episodios
        .filter((e) => e?.thumbnail_image)
        .map((e) => deleteImageFromStorage(e.thumbnail_image)),
    ];

    await Promise.all(deletePromises);

    console.log(
      "✅ Eliminadas todas las imágenes de la serie y sus temporadas"
    );
  } catch (error) {
    console.error(
      "❌ Error al eliminar imágenes vinculadas a la serie:",
      error
    );
  }
};

const deleteSeasonWithImages = async (seasonId) => {
  try {
    // 1️⃣ Obtener la imagen de la temporada
    const { data: temporada, error: temporadaError } = await supabase
      .from("SEASON")
      .select("poster_image")
      .eq("id", seasonId)
      .single();

    if (temporadaError) throw temporadaError;

    // 2️⃣ Obtener imágenes de los episodios de la temporada
    const { data: episodios, error: episodiosError } = await supabase
      .from("EPISODES")
      .select("thumbnail_image")
      .eq("season_id", seasonId);

    if (episodiosError) throw episodiosError;

    // 3️⃣ Eliminar todas las imágenes en paralelo
    const deletePromises = [
      temporada?.poster_image
        ? deleteImageFromStorage(temporada.poster_image)
        : null,
      ...episodios
        .filter((e) => e?.thumbnail_image)
        .map((e) => deleteImageFromStorage(e.thumbnail_image)),
    ].filter(Boolean); // Filtrar valores nulos

    await Promise.all(deletePromises);

    console.log("✅ Imágenes de la temporada y episodios eliminadas");

    // 4️⃣ Eliminar la temporada si no tienes ON DELETE CASCADE en la DB
    // const { error: deleteError } = await supabase
    //   .from("SEASON")
    //   .delete()
    //   .eq("id", seasonId);

    // if (deleteError) throw deleteError;

    console.log("✅ Temporada eliminada correctamente");
  } catch (error) {
    console.error(
      "❌ Error al eliminar la temporada e imágenes asociadas:",
      error
    );
  }
};

export { deleteSeriesWithImages, deleteSeasonWithImages };
