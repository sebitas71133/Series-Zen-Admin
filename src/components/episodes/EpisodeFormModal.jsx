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
import { Controller, set, useForm } from "react-hook-form";

import { AddCircleOutline, Edit } from "@mui/icons-material";
import { ImageUpload } from "../ImageUpload";

import { useImageUpload } from "../../hooks/useImageUpload";
import { cleanObject } from "../../utils/cleanObject";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { deleteImageFromStorage } from "../../utils/imageUtils";

export const EpisodeFormModal = ({
  handleCloseModal,
  openModal,
  selectedEpisodeToEdit,
  onSubmit,
  isLoading,
  temporadaId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      release_date: null,
    },
  });

  const {
    image: thumbnailImage,
    handleImageChange,
    uploadImage,
  } = useImageUpload(selectedEpisodeToEdit?.thumbnail_image, "episodes");

  useEffect(() => {
    if (selectedEpisodeToEdit) {
      setValue("episode_number", selectedEpisodeToEdit.episode_number);
      setValue("title", selectedEpisodeToEdit.title);
      setValue("description", selectedEpisodeToEdit.description);
      setValue("release_date", dayjs(selectedEpisodeToEdit.release_date));
      setValue("duration", selectedEpisodeToEdit.duration);
      // setValue("poster_image", selectedEpisodeToEdit.poster_image);

      console.log("seleccionado episodio para editar");
    } else {
      reset();
      console.log("episodio para no editar");
    }

    console.log("effect", selectedEpisodeToEdit);
  }, [selectedEpisodeToEdit, setValue, handleCloseModal]);

  const onSubmitForm = async (formData) => {
    let newEpisode = null;
    try {
      const cleanedData = {
        ...cleanObject(formData),

        ...(selectedEpisodeToEdit && {
          id: parseInt(selectedEpisodeToEdit.id),
        }),
      };

      let { imageUrl, error } = await uploadImage(
        selectedEpisodeToEdit?.thumbnail_image
      );

      if (error) throw error;

      // Crear objeto con los datos de la episodio
      newEpisode = {
        ...cleanedData,
        season_id: temporadaId,

        thumbnail_image: imageUrl,
      };

      console.log({ newEpisode });

      console.log("Datos del episodio a guardar/editar:", newEpisode); // Verifica que las URLs estén correctas

      await onSubmit(newEpisode, !!selectedEpisodeToEdit);
    } catch (error) {
      console.error("Error saving o editting episodios:", error);
      if (
        error.message.includes("duplicate key") &&
        newEpisode.thumbnail_image
      ) {
        console.log(
          "Eliminando imagen subida de episodio porque el episodio no se guardó..."
        );
        await deleteImageFromStorage(newEpisode.thumbnail_image);
      }
    } finally {
      handleImageChange(null);
    }
  };
  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogTitle color="primary">
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {selectedEpisodeToEdit ? <Edit /> : <AddCircleOutline />}
            <Typography variant="h6">
              {selectedEpisodeToEdit ? "Edit Episode" : "Add New Episode"}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {/* Campos del formulario */}
          <TextField
            label="Number"
            variant="standard"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0, max: 100, step: 0.1 }}
            {...register("episode_number", {
              required: "Number of episode is required",
              min: { value: 0, message: "Number must be at least 0" },
              max: { value: 100, message: "Number must be at most 100" },
            })}
            error={!!errors.episode_number}
            helperText={errors.episode_number?.message}
          />

          <TextField
            label="Title"
            variant="standard"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            {...register("title", {
              // required: "Description is required",
            })}
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
            label="Duration"
            variant="standard"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ min: 0, max: 100, step: 1 }}
            {...register("duration", {
              min: { value: 0, message: "Duration must be at least 0" },
              max: { value: 100, message: "Duration must be at most 100" },
            })}
            error={!!errors.duration}
            helperText={errors.duration?.message}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="release_date"
              control={control}
              rules={{
                // required: "La fecha de estreno es obligatoria",
                validate: (value) => {
                  const year = dayjs(value).year();
                  if (year < 1900 || year > new Date().getFullYear()) {
                    return `El año debe estar entre 1900 y ${new Date().getFullYear()}`;
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  label="Fecha de estreno"
                  slotProps={{
                    textField: {
                      error: !!errors.release_date,
                      helperText: errors.release_date?.message,
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <TextField
            label="Video URL"
            variant="standard"
            fullWidth
            margin="normal"
            {...register("video_url", {
              //required: "El enlace del video es obligatorio",
              pattern: {
                value:
                  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com|mega\.nz)\/.+$/,
                message:
                  "Debe ser un enlace válido (YouTube, Vimeo, Google Drive, MEGA)",
              },
            })}
            error={!!errors.video_url}
            helperText={errors.video_url?.message}
          />

          <ImageUpload
            message="Thumbnail"
            currentImage={thumbnailImage.url}
            onImageChange={handleImageChange}
            isAddingElement={isLoading}
          />
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
              : selectedEpisodeToEdit
              ? "Save Changes"
              : "Add Episode"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
