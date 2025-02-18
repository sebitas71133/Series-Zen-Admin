import { supabase } from "../../config/supabaseClient";
import { deleteImageFromStorage } from "./imageUtils";

const deleteSeriesWithImages = async (serieId) => {
  try {
    // 1. Obtener las imágenes de las temporadas antes de eliminarlas
    const { data: temporadas, error: temporadasError } = await supabase
      .from("SEASON")
      .select("poster_image")
      .eq("series_id", serieId);

    if (temporadasError) throw temporadasError;

    // 2 Eliminar imágenes en paralelo
    const deletePromises = temporadas
      .filter((t) => t?.poster_image) // Filtrar imágenes no nulas
      .map((t) => deleteImageFromStorage(t.poster_image));

    await Promise.all(deletePromises);

    console.log("✅ Eliminada todas las imagenes vinculadas a las series");
  } catch (error) {
    console.error(" Error al eliminar imagenes viculadas a la serie ", error);
  }
};

const deleteSeasonWithImages = async (seasonId) => {
  try {
    // 1. Obtener la imagen de la temporada
    const { data: temporada, error: temporadaError } = await supabase
      .from("SEASON")
      .select("poster_image")
      .eq("id", seasonId)
      .single();

    if (temporadaError) throw temporadaError;

    // 2. Obtener imágenes de episodios de la temporada
    const { data: episodios, error: episodiosError } = await supabase
      .from("EPISODES")
      .select("thumbnail_image")
      .eq("season_id", seasonId);

    if (episodiosError) throw episodiosError;

    // 3. Eliminar imágenes en paralelo
    const deletePromises = [
      ...(temporada?.poster_image
        ? [deleteImageFromStorage(temporada.poster_image)]
        : []),
      ...episodios
        .filter((e) => e?.thumbnail_image)
        .map((e) => deleteImageFromStorage(e.thumbnail_image)),
    ];

    await Promise.all(deletePromises);

    console.log("✅ Eliminadas todas las imágenes vinculadas a la temporada");

    // 4. (Opcional) Eliminar la temporada si no tienes ON DELETE CASCADE
    const { error: deleteError } = await supabase
      .from("SEASON")
      .delete()
      .eq("id", seasonId);

    if (deleteError) throw deleteError;

    console.log("✅ Temporada eliminada correctamente");
  } catch (error) {
    console.error("❌ Error al eliminar imágenes o la temporada:", error);
  }
};

export { deleteSeriesWithImages, deleteSeasonWithImages };
