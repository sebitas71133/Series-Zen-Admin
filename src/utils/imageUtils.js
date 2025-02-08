import { supabase } from "../../config/supabaseClient";

export const uploadImageToStorage = async (file, folder, oldImageUrl) => {
  try {
    if (oldImageUrl) {
      deleteImageFromStorage(oldImageUrl);
    }

    const fileName = `${folder}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("SeriesZenMedia")
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("SeriesZenMedia")
      .getPublicUrl(fileName);

    return { data: urlData, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const deleteImageFromStorage = async (imageUrl) => {
  console.log("Deleting image:", imageUrl);

  try {
    // Validar la URL
    if (!isValidSupabaseUrl(imageUrl)) {
      throw new Error("URL de imagen no válida");
    }

    // Extraer el path completo desde la URL
    const url = new URL(imageUrl);
    const path = url.pathname.split(
      "/storage/v1/object/public/SeriesZenMedia/"
    )[1];
    console.log("Extracted path:", path);

    if (!path) {
      throw new Error("No se pudo extraer el path de la imagen");
    }

    // Eliminar la imagen
    const { error } = await supabase.storage
      .from("SeriesZenMedia")
      .remove([path]);

    if (error) {
      throw error;
    }

    console.log("Image deleted successfully");
    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting image:", error);
    return { success: false, error };
  }
};

const isValidSupabaseUrl = (url) => {
  const supabasePattern =
    /https:\/\/[a-zA-Z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/SeriesZenMedia\//;
  return supabasePattern.test(url);
};
