import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { useCallback, useEffect, useState } from "react";

import SerieFilters from "../components/common/SerieFilters";

import AddButton from "../components/common/AddButton";

import { Loading } from "../components/common/Loading";

import {
  useAddSerieMutation,
  useDeleteSerieMutation,
  useFetchSeriesQuery,
  useUpdateSerieMutation,
} from "../../services/seriesApi";
import { SubmitLoading } from "../components/common/SubmitLoading";

import { deleteSeriesWithImages } from "../utils/deleteElementWithImages";

import { ItemsList } from "../components/common/ItemsList";
import { SerieCard } from "../components/series/SerieCard";
import { SeriesFormModal } from "../components/series/SeriesFormModal";

export default function SeriesPage() {
  // const [series, setSeries] = useState(initialSeries);
  const [openModal, setOpenModal] = useState(false); //Modal para añadir o editar en formulario
  const [selectedSerieToEdit, setSelectedSerie] = useState(null); //Serie actual para editar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Estado para almacenar la serie seleccionada para eliminar
  const [selectedSerieToDelete, setSelectedSerieToDelete] = useState(null);
  //Estado para controlar la visibilidad del diálogo de confirmación
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  // Obtener las mutaciones de add y edit con sus estados

  const {
    data: seriesData,
    isSuccess: isSuccessSeriesData,
    isLoading: isLoadingSeriesData,
    isError: isErrorSeriesData,
  } = useFetchSeriesQuery();

  const [
    addSerie,
    { isLoading: isAdding, isSuccess: isAddSuccess, isError: addError },
  ] = useAddSerieMutation();
  const [
    updateSerie,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: updateError },
  ] = useUpdateSerieMutation();

  const [
    deleteSerie,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError: deleteError },
  ] = useDeleteSerieMutation();

  // Estados combinados para SubmitLoading
  const isLoading = isAdding || isUpdating || isDeleting;

  useEffect(() => {
    if (isDeleteSuccess || isAddSuccess || isUpdateSuccess) {
      setSnackbarOpen(true);
    }
  }, [isDeleteSuccess, isAddSuccess, isUpdateSuccess]);

  /*********************** SUBIR SERIE ***************************/

  const handleSubmitSerie = async (newSerie, isEdit) => {
    setErrorMessage(null);
    try {
      if (isEdit) {
        await updateSerie(newSerie).unwrap();
      } else {
        await addSerie(newSerie).unwrap();
      }

      handleCloseModal(); // Cerrar el modal
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error:", error);
      throw error; //Para que lo capture "onSubmit"
    } finally {
      setSnackbarOpen(true);
    }
  };

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

  /************************ PROCESO DE ELIMINACION ************************/

  /**
   * Abre el cuadro de diálogo de confirmación para eliminar una serie
   * Objeto de la serie a eliminar
   */
  const handleOpenDeleteConfirmation = (serie) => {
    setSelectedSerieToDelete(serie);
    setOpenConfirmDelete(true);
  };

  /**
   * Cierra el cuadro de diálogo de confirmación
   *Se establece la serie seleccionada para eliminar en null
   */
  const handleCloseDeleteConfirmation = () => {
    setSelectedSerieToDelete(null);
    setOpenConfirmDelete(false);
  };

  /**
   * Confirmar la eliminacion de una serie
   * Si la serie seleccionada para eliminar no existe, salir
   * Se obtiene el id y las imágenes de la serie seleccionada(si existen)
   * Se eliminan las imágenes asociadas si existen
   * Se elimina la serie de la base de datos
   * Si ocurre un error, se muestra en la consola
   * Cierra el cuadro de diálogo de confirmación
   * @returns
   */

  const handleConfirmDeleteSerie = async () => {
    if (!selectedSerieToDelete) return;
    setErrorMessage(null);
    //const { id, cover_image, banner_image } = selectedSerieToDelete;
    const { id } = selectedSerieToDelete;

    //Eliminar todas las imagenes de sus temporadas tambien

    // 🔹 2. Eliminar imágenes de portada y banner en paralelo
    //  const deleteCover = cover_image
    //    ? deleteImageFromStorage(cover_image)
    //    : null;
    //  const deleteBanner = banner_image
    //   ? deleteImageFromStorage(banner_image)
    //    : null;

    // await Promise.all([deleteCover, deleteBanner].filter(Boolean));

    try {
      await deleteSeriesWithImages(id);
      await deleteSerie(id).unwrap();
      console.log("Eliminado serie con id:", id);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error eliminando serie:", error);
    } finally {
      setSnackbarOpen(true);
      handleCloseDeleteConfirmation();
    }
  };

  if (isLoadingSeriesData) return <Loading />;
  // if (isErrorSeriesData) return <div>{errorSeriesData}</div>;

  console.log(seriesData);

  return (
    <>
      <Box>
        {/* <SerieFilters /> */}
        {/* BOTON PARA AGREGAR SERIE */}
        {/* Manejador para abir el modal en el caso de añadir serie */}
        <AddButton
          handleOpenAddModal={handleOpenAddModal}
          message={"Add Series"}
        ></AddButton>
        {/* LISTA - GRID DE SERIES */}
        {/* <SeriesList
          series={seriesData} //Lista de series
          handleDeleteElement={handleOpenDeleteConfirmation} // Manejador para eliminar una serie
          handleOpenEditModal={handleOpenEditModal} // Manejador para abrir el modal en caso de editar serie
        ></SeriesList> */}
        <ItemsList
          items={seriesData}
          CardComponent={SerieCard}
          handleOpenEditModal={handleOpenEditModal}
          handleDeleteElement={handleOpenDeleteConfirmation}
        />
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
          isSubmitting={isAdding || isDeleting || isUpdating}
          success={isAddSuccess || isDeleteSuccess || isUpdateSuccess}
          errorMessage={errorMessage}
          isEditing={!!selectedSerieToEdit}
          isDeleteSuccess={isDeleteSuccess}
        />
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
            <Button onClick={handleConfirmDeleteSerie} color="error" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}
