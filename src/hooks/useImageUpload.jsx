import React, { useEffect, useState } from "react";
import {
  deleteImageFromStorage,
  uploadImageToStorage,
} from "../utils/imageUtils";

export const useImageUpload = (initialUrl, folder = "temporadas") => {
  const [image, setImageUrl] = useState({
    file: null,
    url: initialUrl || "",
    isDeleted: false,
    isChanged: false, // 🔄 Indica si hubo un cambio en la imagen
  });

  useEffect(() => {
    setImageUrl((prevState) => ({ ...prevState, url: initialUrl || "" }));
  }, [initialUrl]);

  const handleImageChange = (file) => {
    if (!file) {
      console.log("No file selected");

      setImageUrl({ file: null, url: "", isDeleted: true, isChanged: true });
      return;
    }
    setImageUrl({
      file,
      url: URL.createObjectURL(file),
      isDeleted: false,
      isChanged: true,
    });
  };

  const uploadImage = async (oldImageUrl) => {
    let imageUrl = oldImageUrl || "";

    if (!image.isChanged) {
      console.log("🔄 La imagen no ha cambiado, no se sube nada.");
      return { imageUrl: oldImageUrl, error: null };
    }

    try {
      let newImageUrl = "";

      if (image.file) {
        console.log("📤 Subiendo nueva imagen...");
        const { data: uploadData, error } = await uploadImageToStorage(
          image.file,
          folder
        );
        if (error) throw error;
        newImageUrl = uploadData.publicUrl;
      }

      // ✅ Si se subió una nueva imagen con éxito, elimina la anterior
      if (newImageUrl && oldImageUrl) {
        console.log("🗑 Eliminando imagen anterior...");
        await deleteImageFromStorage(oldImageUrl);
      }

      // ✅ Actualiza el estado con la nueva URL solo si se subió correctamente
      if (newImageUrl) {
        setImageUrl((prevState) => ({
          ...prevState,
          url: newImageUrl,
          isChanged: false,
        }));
        imageUrl = newImageUrl;
      }

      return { imageUrl, error: null };
    } catch (error) {
      console.error("❌ Error al subir imagen:", error);
      return { imageUrl: null, error };
    }
  };

  return { image: image, handleImageChange, uploadImage };
};

// const uploadImage = async (oldImageUrl) => {
//   let imageUrl = oldImageUrl || "";
//   //let imageUrl = "";

//   /**

//   if (!image.isChanged) {
//     console.log("🔄 La imagen no ha cambiado, no se sube nada.");
//     return { imageUrl: oldImageUrl, error: null };
//   }

//   /**

//   try {
//     if ((image.isDeleted || image.isChanged) && oldImageUrl) {
//       if (oldImageUrl) {
//         console.log("Deleting image from storage");
//         await deleteImageFromStorage(oldImageUrl);
//         imageUrl = "";
//       }
//     }

//     /**

//     if (image.file) {
//       console.log("📤 Subiendo nueva imagen...");
//       const { data: uploadData, error } = await uploadImageToStorage(
//         image.file,
//         folder
//       );
//       if (error) throw error;
//       imageUrl = uploadData.publicUrl;
//     }

//     setImageUrl((prevState) => ({ ...prevState, isChanged: false }));

//     return { imageUrl, error: null };
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     return { imageUrl: null, error };
//   }
// };
