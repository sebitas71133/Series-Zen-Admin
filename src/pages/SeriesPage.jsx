import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useCallback, useState } from "react";

import BreadcrumbsComponent from "../layout/components/BreadcrumbsComponent";

import SerieFilters from "../components/SerieFilters";

import AddButton from "../components/AddButton";
import SeriesList from "../components/SeriesList";

import { Loading } from "../components/Loading";

import { SeriesFormModal } from "../components/SeriesFormModal";

import {
  useAddSerieMutation,
  useDeleteSerieMutation,
  useFetchSeriesQuery,
  useUpdateSerieMutation,
} from "../../services/seriesApi";
import { SubmitLoading } from "../components/SubmitLoading";
import { deleteImageFromStorage } from "../utils/imageUtils";

export default function SeriesPage() {
  // const [series, setSeries] = useState(initialSeries);
  const [openModal, setOpenModal] = useState(false); //Modal para añadir o editar en formulario
  const [selectedSerieToEdit, setSelectedSerie] = useState(null); //Serie actual para editar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false); //Modal para confirmar eliminación
  const [selectedSerieToDelete, setSelectedSerieToDelete] = useState(null); //Serie actual para eliminar

  const handleOpenConfirmDelete = (serie) => {
    setSelectedSerieToDelete(serie);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setSelectedSerieToDelete(null);
    setOpenConfirmDelete(false);
  };

  // Obtener las mutaciones de add y edit con sus estados
  const [
    addSerie,
    { isLoading: isAdding, isSuccess: isAddSuccess, error: addError },
  ] = useAddSerieMutation();
  const [
    updateSerie,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError },
  ] = useUpdateSerieMutation();

  const [
    deleteSerie,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess, error: deleteError },
  ] = useDeleteSerieMutation();

  // Estados combinados para SubmitLoading
  const isLoading = isAdding || isUpdating || isDeleting;
  const isSuccess = isAddSuccess || isUpdateSuccess || isDeleteSuccess;
  const errorMessage =
    addError?.message || updateError?.message || deleteError?.message;

  // Función para manejar el submit del formulario
  const handleSubmitSerie = async (newSerie, isEdit) => {
    try {
      if (isEdit) {
        await updateSerie(newSerie).unwrap();
      } else {
        await addSerie(newSerie).unwrap();
      }
      setSnackbarOpen(true); // Mostrar el mensaje de éxito
      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const {
    data: seriesData,
    error: errorSeriesData,
    isLoading: isLoadingSeriesData,
    isError: isErrorSeriesData,
  } = useFetchSeriesQuery();

  const handleOpenAddModal = useCallback(() => {
    setSelectedSerie(null);
    setOpenModal(true);
  }, []);

  const handleOpenEditModal = useCallback((serieData) => {
    setSelectedSerie(serieData);
    setOpenModal(true);
  }, []);

  //Cuando se cierra el modal
  const handleCloseModal = useCallback(() => {
    setOpenModal(false); //Se establece el modal cerrado o false
  }, []);

  const handleDeleteSerie = async () => {
    if (!selectedSerieToDelete) return;

    const { id, cover_image, banner_image } = selectedSerieToDelete;
    // Eliminar imágenes asociadas
    if (cover_image) {
      await deleteImageFromStorage(cover_image);
    }
    if (banner_image) {
      await deleteImageFromStorage(banner_image);
    }

    try {
      await deleteSerie(id).unwrap();
      console.log("Eliminado serie con id:", id);
    } catch (error) {
      console.error("Error eliminando serie:", error);
    }
    handleCloseConfirmDelete();
  };

  if (isLoadingSeriesData) return <Loading />;
  if (isErrorSeriesData) return <div>{errorSeriesData}</div>;

  console.log(seriesData);

  return (
    <>
      <BreadcrumbsComponent></BreadcrumbsComponent>
      <Box>
        <SerieFilters />
        {/* BOTON PARA AGREGAR SERIE */}
        {/* Manejador para abir el modal en el caso de añadir serie */}
        <AddButton handleOpenAddModal={handleOpenAddModal}></AddButton>
        {/* LISTA - GRID DE SERIES */}
        <SeriesList
          series={seriesData} //Lista de series
          handleDeleteElement={handleOpenConfirmDelete} // Manejador para eliminar una serie
          handleOpenEditModal={handleOpenEditModal} // Manejador para abrir el modal en caso de editar serie
        ></SeriesList>
        {/* DIALOG - FORMULARIO PARA AGREGAR O EDITAR UNA SERIE */}
        <SeriesFormModal
          handleCloseModal={handleCloseModal} //Manejador para cerrar el modal
          openModal={openModal} //Estado del modal
          selectedSerieToEdit={selectedSerieToEdit} //Enviar la serie actual
          onSubmit={handleSubmitSerie} // Función para add/edit
          isLoading={isLoading} // Estado de carga
        ></SeriesFormModal>

        <SubmitLoading
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          isSubmitting={isLoading}
          success={isSuccess}
          errorMessage={errorMessage}
          isEditing={!!selectedSerieToEdit}
        />
        <Dialog
          open={openConfirmDelete}
          onClose={handleCloseConfirmDelete}
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
            <Button onClick={handleCloseConfirmDelete} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteSerie} color="error" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
