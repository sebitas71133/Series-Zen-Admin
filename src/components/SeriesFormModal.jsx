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

const SeriesFormModal = ({
  handleCloseModal,
  handleSaveSeries,
  openModal,
  selectedSerie,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  console.log(errors);
  const [coverFile, setCoverFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Establecer valores iniciales cuando `selectedSerie` cambie
  useEffect(() => {
    if (selectedSerie) {
      // Se establece los valores iniciales para las campos del formulario
      setValue("title", selectedSerie.title || "");
      setValue("description", selectedSerie.description || "");
      setValue("rating", selectedSerie.rating || 0);
      setValue("slug", selectedSerie.slug || "");
      setCoverFile(selectedSerie.cover_image || null); // Imagen de portada
      setBannerFile(selectedSerie.banner_image || null); // Imagen de banner
    } else {
      reset(); // Limpia el formulario si no hay serie actual
      setCoverFile(null);
      setBannerFile(null);
    }
  }, [selectedSerie, setValue, reset]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Aquí podrías hacer la llamada a la API
      setTimeout(() => {
        console.log(data);
        setSnackbarOpen(true);
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*FORMULARIO TITULO */}
        <DialogTitle color="primary">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {selectedSerie ? (
              <Edit color="primary" fontSize="large" />
            ) : (
              <AddCircleOutline color="primary" fontSize="large" />
            )}
            <Typography
              variant="h6"
              sx={{
                color: "primary.main",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {selectedSerie ? "Edit Serie" : "Add New Serie"}
            </Typography>
          </Box>
        </DialogTitle>

        {/* FORMULARIO CONTENIDO */}
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 2,
          }}
        >
          <TextField
            id="title-outlined-basic"
            label="Title"
            variant="standard"
            type="text"
            placeholder="Stranger Things"
            {...register("title", { required: true, maxLength: 255 })}
            aria-invalid={errors.title ? "true" : "false"}
          />
          {errors.title?.type === "required" && (
            <Typography color="error">Title is required</Typography>
          )}
          <TextField
            id="description-outlined-basic"
            label="Description"
            variant="standard"
            type="text"
            multiline
            rows={4}
            placeholder="A group of kids face supernatural..."
            {...register("description")}
          />
          <TextField
            id="rating-outlined-basic"
            label="Rating"
            variant="standard"
            type="number"
            placeholder="5.5"
            slotProps={{
              htmlInput: {
                max: 10, // Límite máximo
                min: 0, // Límite mínimo
                step: 0.1,
              },
            }}
            {...register("rating", { max: 10, min: 0 })}
          />
          {errors.rating?.type === "max" && (
            <Typography color="error">Max rating 10</Typography>
          )}
          {errors.rating?.type === "min" && (
            <Typography color="error">Min rating 0</Typography>
          )}

          <TextField
            id="slig-outlined-basic"
            label="Slug"
            type="text"
            variant="standard"
            placeholder="stranger-things"
            {...register("slug", { required: true, maxLength: 20 })}
          />
          {errors.slug?.type === "required" ? (
            <Typography color="error">Slug is required</Typography>
          ) : (
            errors.slug?.type === "maxLength" && (
              <Typography color="error">MaxLengrh 20</Typography>
            )
          )}

          {/*------------------------ IMAGENES---------------------- */}

          <Grid2
            container
            spacing={2}
            justifyContent={"center"}
            alignItems={"center"}
            mt={4}
          >
            <Grid2 item size={{ xs: 12, sm: 6 }}>
              <ImageUpload
                message={"Cover"}
                selectedFileImage={coverFile}
                setSelectedFile={setCoverFile}
                selectedSerie={selectedSerie}
              ></ImageUpload>
            </Grid2>
            <Grid2 item size={{ xs: 12, sm: 6 }}>
              <ImageUpload
                message={"Banner"}
                selectedFileImage={bannerFile}
                setSelectedFile={setBannerFile}
                selectedSerie={selectedSerie}
              ></ImageUpload>
            </Grid2>
          </Grid2>

          {/* SUBMIT */}

          <SubmitLoading
            open={snackbarOpen}
            onClose={handleCloseSnackbar}
            errors={errors}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ margin: "20px auto" }}
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Submitting"
              : selectedSerie
              ? "Save Changes"
              : "Add Serie"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default SeriesFormModal;
