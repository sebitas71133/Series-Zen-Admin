import { supabase } from "../../config/supabaseClient";

export const uploadImageToStorage = async (file, folder) => {
  try {
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
  try {
    const path = imageUrl.split("/").pop();
    const { error } = await supabase.storage
      .from("SeriesZenMedia")
      .remove([path]);

    return { success: !error, error };
  } catch (error) {
    return { success: false, error };
  }
};
