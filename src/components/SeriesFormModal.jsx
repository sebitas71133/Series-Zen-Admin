import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Grid2,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImageUpload } from "./ImageUpload";
import { SubmitLoading } from "./SubmitLoading";
import { AddCircleOutline, Edit } from "@mui/icons-material";

import { uploadImageToStorage } from "../utils/imageUtils";

export const SeriesFormModal = ({
  handleCloseModal,
  openModal,
  selectedSerieToEdit,
  onSubmit,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const [coverImage, setCoverImage] = useState({ file: null, url: "" });
  const [bannerImage, setBannerImage] = useState({ file: null, url: "" });

  useEffect(() => {
    if (selectedSerieToEdit) {
      setValue("title", selectedSerieToEdit.title);
      setValue("description", selectedSerieToEdit.description);
      setValue("rating", selectedSerieToEdit.rating);
      setValue("slug", selectedSerieToEdit.slug);
      setValue("release_year", selectedSerieToEdit.release_year);
      setCoverImage({ file: null, url: selectedSerieToEdit.cover_image });
      setBannerImage({ file: null, url: selectedSerieToEdit.banner_image });

      console.log("seleccionado serie");
    } else {
      reset();
      setCoverImage({ file: null, url: "" });
      setBannerImage({ file: null, url: "" });
      console.log("serie no eleccionada serie");
    }

    console.log("effect", selectedSerieToEdit);
  }, [selectedSerieToEdit, setValue]);

  const onSubmitForm = async (formData) => {
    console.log(formData);

    try {
      const cleanedData = {
        title: formData.title, // Asegura que title no esté vacío
        slug: formData.slug, // Asegura que slug no esté vacío
        description: formData.description || "", // Convierte "" a null
        // Solo envía rating si tiene valor, de lo contrario no lo incluyas
        ...(formData.rating && { rating: parseFloat(formData.rating) }),
        // Solo envía release_year si tiene valor, de lo contrario no lo incluyas
        ...(formData.release_year && {
          release_year: parseInt(formData.release_year),
        }),
        ...(selectedSerieToEdit && { id: parseInt(selectedSerieToEdit.id) }),
      };

      let coverUrl = coverImage.url;
      let bannerUrl = bannerImage.url;

      // Subir nuevas imágenes si existen
      if (coverImage.file) {
        const { data: coverData, error: coverError } =
          await uploadImageToStorage(
            coverImage.file,
            "covers",
            selectedSerieToEdit?.cover_image
          );
        if (coverError) throw coverError;
        coverUrl = coverData.publicUrl;
      }

      if (bannerImage.file) {
        const { data: bannerData, error: bannerError } =
          await uploadImageToStorage(
            bannerImage.file,
            "banners",
            selectedSerieToEdit?.banner_image
          );

        if (bannerError) throw bannerError;
        bannerUrl = bannerData.publicUrl;
      }
      console.log(bannerUrl);

      // Crear objeto con los datos de la serie
      const newSerie = {
        ...cleanedData,
        cover_image: coverUrl,
        banner_image: bannerUrl,
      };

      console.log("Datos de la serie a guardar/editar:", newSerie); // Verifica que las URLs estén correctas

      await onSubmit(newSerie, !!selectedSerieToEdit);
    } catch (error) {
      console.error("Error saving o editting series:", error);
      //setErrorMessage(error.message || "Error saving series");
    }
  };
  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle color="primary">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedSerieToEdit ? <Edit /> : <AddCircleOutline />}
            <Typography variant="h6">
              {selectedSerieToEdit ? "Edit Serie" : "Add New Serie"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {/* Campos del formulario */}
          <TextField
            label="Title"
            variant="standard"
            fullWidth
            margin="normal"
            {...register("title", { required: "Title is required" })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            label="Description"
            variant="standard"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...register("description", {
              // required: "Description is required",
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <TextField
            label="Rating"
            variant="standard"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0, max: 10, step: 0.1 }}
            {...register("rating", {
              //required: "Rating is required",
              min: { value: 0, message: "Rating must be at least 0" },
              max: { value: 10, message: "Rating must be at most 10" },
            })}
            error={!!errors.rating}
            helperText={errors.rating?.message}
          />

          <TextField
            label="Slug"
            variant="standard"
            fullWidth
            margin="normal"
            {...register("slug", { required: "Slug is required" })}
            error={!!errors.slug}
            helperText={errors.slug?.message}
          />

          <TextField
            label="Release Year"
            variant="standard"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 1900, max: new Date().getFullYear() }}
            {...register("release_year", {
              // required: "Release year is required",
              min: { value: 1900, message: "Year must be at least 1900" },
              max: {
                value: new Date().getFullYear(),
                message: `Year must be at most ${new Date().getFullYear()}`,
              },
            })}
            error={!!errors.release_year}
            helperText={errors.release_year?.message}
          />

          {/* Subida de imágenes */}
          <Grid2 container spacing={2} mt={2}>
            <Grid2 xs={12} sm={6}>
              <ImageUpload
                message="Cover"
                currentImage={coverImage.url}
                onImageChange={(file) =>
                  setCoverImage({
                    file,
                    url: file ? URL.createObjectURL(file) : "",
                  })
                }
                isAddingSerie={isLoading}
              />
            </Grid2>

            <Grid2 xs={12} sm={6}>
              <ImageUpload
                message="Banner"
                currentImage={bannerImage.url}
                onImageChange={(file) =>
                  setBannerImage({
                    file,
                    url: file ? URL.createObjectURL(file) : "",
                  })
                }
                isAddingSerie={isLoading}
              />
            </Grid2>
          </Grid2>

          {/* Notificaciones */}
          {/* <SubmitLoading
            open={snackbarOpen}
            onClose={() => setSnackbarOpen(false)}
            isSubmitting={isAddingSerie}
            success={isAddSerieSuccess}
            errorMessage={addSerieErrorMessage}
            isEditing={!!selectedSerieToEdit}
          /> */}
        </DialogContent>

        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading
              ? "Saving..."
              : selectedSerieToEdit
              ? "Save Changes"
              : "Add Serie"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
