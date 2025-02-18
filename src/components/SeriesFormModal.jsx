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

import {
  deleteImageFromStorage,
  uploadImageToStorage,
} from "../utils/imageUtils";
import { useImageUpload } from "../hooks/useImageUpload";
import { cleanObject } from "../utils/cleanObject";

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

  const {
    image: cover_image,
    handleImageChange: handleCoverChange,
    uploadImage: uploadCoverImage,
  } = useImageUpload(selectedSerieToEdit?.cover_image, "covers");

  const {
    image: banner_image,
    handleImageChange: handleBannerChange,
    uploadImage: uploadBannerImage,
  } = useImageUpload(selectedSerieToEdit?.banner_image, "banners");

  useEffect(() => {
    if (selectedSerieToEdit) {
      setValue("title", selectedSerieToEdit.title);
      setValue("description", selectedSerieToEdit.description);
      setValue("rating", selectedSerieToEdit.rating);
      setValue("slug", selectedSerieToEdit.slug);
      setValue("release_year", selectedSerieToEdit.release_year);

      console.log("seleccionado serie");
    } else {
      reset();
      //handleBannerChange(null);
      console.log("serie no eleccionada serie");
    }

    console.log("effect", selectedSerieToEdit);
  }, [selectedSerieToEdit, setValue, handleCloseModal]);

  const onSubmitForm = async (formData) => {
    console.log(formData);

    try {
      const cleanedData = {
        ...cleanObject(formData),
        ...(selectedSerieToEdit && { id: parseInt(selectedSerieToEdit.id) }),
      };

      let { imageUrl: bannerUrl, error: bannerError } = await uploadBannerImage(
        selectedSerieToEdit?.banner_image
      );
      if (bannerError) throw bannerError;

      let { imageUrl: coverUrl, error: coverError } = await uploadCoverImage(
        selectedSerieToEdit?.cover_image
      );
      if (coverError) throw coverError;

      // Subir imágenes a Supabase Storage
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
    } finally {
      handleCoverChange(null);
      handleBannerChange(null);
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
            defaultValue={5}
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
                currentImage={cover_image.url}
                onImageChange={handleCoverChange}
                isAddingSerie={isLoading}
              />
            </Grid2>

            <Grid2 xs={12} sm={6}>
              <ImageUpload
                message="Banner"
                currentImage={banner_image.url}
                onImageChange={handleBannerChange}
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
