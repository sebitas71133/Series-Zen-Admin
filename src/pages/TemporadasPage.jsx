import React, { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useAddTemporadaMutation,
  useDeleteTemporadaMutation,
  useFetchTemporadasQuery,
  useUpdateTemporadaMutation,
} from "../../services/temporadasApi";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddButton from "../components/AddButton";
import { TemporadasList } from "../components/seasons/TemporadasList";
import { TemporadaFormModal } from "../components/seasons/TemporadaFormModal";
import { SubmitLoading } from "../components/SubmitLoading";

import { Loading } from "../components/Loading";
import { deleteSeasonWithImages } from "../utils/deleteElementWithImages";

export const TemporadasPage = () => {
  const { serieId } = useParams();

  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data: temporadasData,
    isSuccess: isSuccessTemporadas,
    isLoading: isLoadingTemporadas,
    isError: errorTemporadas,
  } = useFetchTemporadasQuery(serieId);

  const [
    addTemporada,
    { isLoading: isAdding, isSuccess: isAddSuccess, isError: addError },
  ] = useAddTemporadaMutation();

  const [
    updateTemporada,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
    },
  ] = useUpdateTemporadaMutation();

  const [
    deleteTemporada,
    { isSuccess: isDeleteSuccess, isLoading: isDeleting, isError: deleteError },
  ] = useDeleteTemporadaMutation();

  const isLoading = isAdding || isDeleting || isUpdating;
  // const error = errorTemporadas || addError || deleteError || isUpdateError;
  // const isSuccess = isAddSuccess || isDeleteSuccess || isUpdateSuccess;

  useEffect(() => {
    if (isDeleteSuccess || isAddSuccess || isUpdateSuccess) {
      setSnackbarOpen(true);
    }
  }, [isDeleteSuccess, isAddSuccess, isUpdateSuccess]);

  const [openModal, setOpenModal] = useState(false); //Modal para añadir o editar en formulario
  const [selectedTemporadaToEdit, setSelectedTemporada] = useState(null); //Temporada actual para editar

  const [snackbarOpen, setSnackbarOpen] = useState(false); //Snackbar para mostrar mensaje de éxito

  /********************* SUBIR TEMPORADA ***************** /

  /**
   * Proceso de añadir o editar temporada
   * - Si isEdit es verdadero, se actualiza la temporada
   * - Si isEdit es falso, se añade una nueva temporada
   * - Muestra un mensaje de éxito si la operación fue exitosa
   * - Cierra el modal después de la operación
   */
  const handleSubmitTemporada = async (newTemporada, isEdit) => {
    setErrorMessage(null);
    console.log(newTemporada);

    try {
      if (isEdit) {
        await updateTemporada(newTemporada).unwrap();
      } else {
        await addTemporada(newTemporada).unwrap();
      }

      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error:", error);
      throw error;
    } finally {
      setSnackbarOpen(true);
    }
  };

  //Abrir modal formulario para añadir temporada
  const handleOpenAddModal = useCallback(() => {
    setSelectedTemporada(null);
    setOpenModal(true);
  }, []);

  const handleOpenEditModal = useCallback((temporadaData) => {
    setSelectedTemporada(temporadaData);
    setOpenModal(true);
  }, []);

  //Cerrar modal formulario
  const handleCloseModal = useCallback(() => {
    setOpenModal(false); //Se establece el modal cerrado o false
  }, []);

  /****************** PROCESO DE ELIMINACIÓN ********************/

  // Estado para almacenar la temporada seleccionada para eliminar
  const [selectedTemporadaToDelete, setSelectedTemporadaToDelete] =
    useState(null);

  // Estado para controlar la visibilidad del diálogo de confirmación
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  /**
   * Abre el cuadro de diálogo de confirmación para eliminar una temporada
   * Objeto de la temporada a eliminar
   */
  const handleOpenDeleteConfirmation = (serie) => {
    setSelectedTemporadaToDelete(serie);
    setOpenConfirmDelete(true);
  };

  /**
   * ❌ Cierra el cuadro de diálogo de confirmación
   */
  const handleCloseDeleteConfirmation = () => {
    setSelectedTemporadaToDelete(null);
    setOpenConfirmDelete(false);
  };

  /**
   *   Confirma la eliminación de la temporada seleccionada
   * - Si la temporada tiene una imagen, primero la elimina del almacenamiento.
   * - Luego, intenta eliminar la temporada de la base de datos.
   * - Si ocurre un error, lo muestra en la consola.
   */
  const handleConfirmDeleteTemporada = async () => {
    setErrorMessage(null);
    // Si no hay temporada seleccionada, salir
    if (!selectedTemporadaToDelete) return;

    //Se obtiene el id y la imagen de la temporada(si existe) seleccionada
    const { id, poster_image } = selectedTemporadaToDelete;

    //Se elimina la imagen asociada si existe
    // if (poster_image) {
    //   await deleteImageFromStorage(poster_image);
    // }

    try {
      await deleteSeasonWithImages(id);
      // Eliminar la temporada de la base de datos mediante el id
      await deleteTemporada(id).unwrap();
      console.log("✅ Temporada eliminada con ID:", id);
    } catch (error) {
      console.error("❌ Error al eliminar la temporada:", error);
      setErrorMessage(error.message);
    } finally {
      handleCloseDeleteConfirmation();
    }

    // Cerrar el diálogo después de la eliminación
  };

  if (isLoadingTemporadas) return <Loading />;

  // if (errorMessage) return <div>Error: {errorMessage}</div>;

  console.log(temporadasData);

  return (
    <>
      <Box>
        <AddButton
          message={"Add Season"}
          handleOpenAddModal={handleOpenAddModal}
        ></AddButton>
        <TemporadasList
          temporadas={temporadasData}
          handleDeleteElement={handleOpenDeleteConfirmation}
          handleOpenEditModal={handleOpenEditModal}
        ></TemporadasList>
        <TemporadaFormModal
          handleCloseModal={handleCloseModal}
          openModal={openModal}
          selectedTemporadaToEdit={selectedTemporadaToEdit}
          onSubmit={handleSubmitTemporada}
          isLoading={isLoading}
          serieId={serieId}
        ></TemporadaFormModal>

        {/* Se muestra mensaje de agregar/actualiza/eliminar */}
        <SubmitLoading
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          isSubmitting={isAdding || isDeleting || isUpdating}
          success={isAddSuccess || isDeleteSuccess || isUpdateSuccess}
          errorMessage={errorMessage}
          isEditing={!!selectedTemporadaToEdit}
          isDeleteSuccess={isDeleteSuccess}
        />

        {/* Diálogo de confirmación para eliminar una temporada */}
        <Dialog
          open={openConfirmDelete}
          onClose={handleCloseDeleteConfirmation}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Confirmar elimincaciòn"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              ¿Estás seguro de que deseas eliminar la serie? Esta acción no se
              puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirmation} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDeleteTemporada}
              color="error"
              autoFocus
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};
