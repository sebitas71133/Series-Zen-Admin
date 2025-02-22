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
  IconButton,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { set, useForm } from "react-hook-form";
import CancelIcon from "@mui/icons-material/Cancel";

import { AddCircleOutline, Edit } from "@mui/icons-material";
import { ImageUpload } from "../common/ImageUpload";

import { useImageUpload } from "../../hooks/useImageUpload";
import { cleanObject } from "../../utils/cleanObject";
import { deleteImageFromStorage } from "../../utils/imageUtils";
import { useSelector } from "react-redux";

export const TemporadaFormModal = ({
  handleCloseModal,
  openModal,
  selectedTemporadaToEdit,
  onSubmit,
  isLoading,
  serieId,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const {
    image: posterImage,
    handleImageChange,
    uploadImage,
  } = useImageUpload(selectedTemporadaToEdit?.poster_image, "temporadas");

  const { email, loading } = useSelector((state) => state.session);

  useEffect(() => {
    if (selectedTemporadaToEdit) {
      setValue("season_number", selectedTemporadaToEdit.season_number);
      setValue("description", selectedTemporadaToEdit.description);
      setValue("release_year", selectedTemporadaToEdit.release_year);
      // setValue("poster_image", selectedTemporadaToEdit.poster_image);

      console.log("seleccionado temporada para editar");
    } else {
      reset();
      handleImageChange(null);
      console.log("Temporada para no editar");
    }
  }, [selectedTemporadaToEdit, setValue, openModal]);

  const onSubmitForm = async (formData) => {
    console.log(formData);
    let newTemporada = null;
    try {
      const cleanedData = {
        ...cleanObject(formData),

        ...(selectedTemporadaToEdit && {
          id: parseInt(selectedTemporadaToEdit.id),
        }),
      };

      let { imageUrl, error } = await uploadImage(
        selectedTemporadaToEdit?.poster_image
      );

      if (error) throw error;

      // Crear objeto con los datos de la serie
      newTemporada = {
        ...cleanedData,
        series_id: serieId,

        poster_image: imageUrl,
      };

      console.log({ newTemporada });

      console.log("Datos de la serie a guardar/editar:", newTemporada); // Verifica que las URLs estén correctas

      await onSubmit(newTemporada, !!selectedTemporadaToEdit);
    } catch (error) {
      console.error("Error saving o editting temporadas:", error);
      if (
        (error.message.includes("duplicate key") &&
          newTemporada.poster_image) ||
        error.message.includes('null value in column "series_id"')
      ) {
        console.log(
          "Eliminando imagen subida de temporada porque la temporada no se guardó..."
        );
        await deleteImageFromStorage(newTemporada.poster_image);
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
            {selectedTemporadaToEdit ? <Edit /> : <AddCircleOutline />}
            <Typography variant="h6" flexGrow={1}>
              {selectedTemporadaToEdit ? "Edit Season" : "Add New Season"}
            </Typography>
            <IconButton
              onClick={handleCloseModal}
              color="error"
              sx={{ ml: "auto" }}
            >
              <CancelIcon fontSize="large" />
            </IconButton>
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
            {...register("season_number", {
              required: "Number of season is required",
              min: { value: 0, message: "Rating must be at least 0" },
              max: { value: 100, message: "Rating must be at most 100" },
            })}
            error={!!errors.season_number}
            helperText={errors.season_number?.message}
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
          <ImageUpload
            message="Cover"
            currentImage={posterImage.url}
            onImageChange={handleImageChange}
            isAddingElement={isLoading}
          />
        </DialogContent>

        <DialogActions>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || email === "demo@zen.com"}
          >
            {isLoading
              ? "Saving..."
              : selectedTemporadaToEdit
              ? "Save Changes"
              : "Add Season"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
