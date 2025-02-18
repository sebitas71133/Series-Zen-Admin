import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  useAddEpisodeMutation,
  useDeleteEpisodeMutation,
  useFetchEpisodesQuery,
  useUpdateEpisodeMutation,
} from "../../services/episodesApi";
import { Loading } from "../components/Loading";
import SerieFilters from "../components/SerieFilters";

import AddButton from "../components/AddButton";
import { ItemsList } from "../components/common/ItemsList";
import { EpisodeCard } from "../components/episodes/EpisodeCard";
import { deleteImageFromStorage } from "../utils/imageUtils";
import { SeriesFormModal } from "../components/SeriesFormModal";
import { SubmitLoading } from "../components/SubmitLoading";
import { EpisodeFormModal } from "../components/episodes/EpisodeFormModal";

export const EpisodePage = () => {
  /*  DATA DEL SLUG, SEASON_NUMBER, TEMPORADA_  */

  const { slug, season_number } = useParams();

  const location = useLocation();
  const { temporadaId } = location.state;

  /******************************************************** */

  const [openModal, setOpenModal] = useState(false); //Modal para añadir o editar en formulario
  const [selectedEpisodeToEdit, setSelectedEpisode] = useState(null); //Episode actual para editar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  // Estado para almacenar la Episode seleccionada para eliminar
  const [selectedEpisodeToDelete, setSelectedEpisodeToDelete] = useState(null);
  //Estado para controlar la visibilidad del diálogo de confirmación
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  /*** OBTENER DATA DE RTK QUERY */

  const {
    data: episodesData,
    isSuccess: isSuccessEpisodeData,
    isLoading: isLoadingEpisodesData,
    isError: isErrorEpisodesData,
  } = useFetchEpisodesQuery(temporadaId);

  const [
    addEpisode,
    { isLoading: isAdding, isSuccess: isAddSuccess, isError: addError },
  ] = useAddEpisodeMutation();
  const [
    updateEpisode,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: updateError },
  ] = useUpdateEpisodeMutation();

  const [
    deleteEpisode,
    { isLoading: isDeleting, isSuccess: isDeleteSuccess, isError: deleteError },
  ] = useDeleteEpisodeMutation();

  // Estados combinados para SubmitLoading
  const isLoading = isAdding || isUpdating || isDeleting;

  useEffect(() => {
    if (isDeleteSuccess || isAddSuccess || isUpdateSuccess) {
      setSnackbarOpen(true);
    }
  }, [isDeleteSuccess, isAddSuccess, isUpdateSuccess]);

  /*********************** SUBIR EPISODE ***************************/

  const handleSubmitEpisode = async (newEpisode, isEdit) => {
    console.log(newEpisode);

    setErrorMessage(null);
    try {
      if (isEdit) {
        await updateEpisode(newEpisode).unwrap();
      } else {
        await addEpisode(newEpisode).unwrap();
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
    setSelectedEpisode(null);
    setOpenModal(true);
  }, []);

  const handleOpenEditModal = useCallback((episodeData) => {
    setSelectedEpisode(episodeData);
    setOpenModal(true);
  }, []);

  //Cuando se cierra el modal
  const handleCloseModal = useCallback(() => {
    setOpenModal(false); //Se establece el modal cerrado o false
  }, []);

  /************************ PROCESO DE ELIMINACION ************************/

  /**
   * Abre el cuadro de diálogo de confirmación para eliminar una episodio
   * Objeto de la episodio a eliminar
   */
  const handleOpenDeleteConfirmation = (episodio) => {
    setSelectedEpisodeToDelete(episodio);
    setOpenConfirmDelete(true);
  };

  /**
   * Cierra el cuadro de diálogo de confirmación
   *Se establece la episodio seleccionada para eliminar en null
   */
  const handleCloseDeleteConfirmation = () => {
    setSelectedEpisodeToDelete(null);
    setOpenConfirmDelete(false);
  };

  /**
   * Confirmar la eliminacion de una episodio
   * Si la episodio seleccionada para eliminar no existe, salir
   * Se obtiene el id y las imágenes de la episodio seleccionada(si existen)
   * Se eliminan las imágenes asociadas si existen
   * Se elimina la episodio de la base de datos
   * Si ocurre un error, se muestra en la consola
   * Cierra el cuadro de diálogo de confirmación
   * @returns
   */

  const handleConfirmDeleteEpisode = async () => {
    setErrorMessage(null);
    if (!selectedEpisodeToDelete) return;
    const { id, thumbnail_image } = selectedEpisodeToDelete;

    if (thumbnail_image) {
      await deleteImageFromStorage(thumbnail_image);
    }

    try {
      await deleteEpisode(id).unwrap();
      console.log("Eliminado episode con id:", id);
    } catch (error) {
      console.error("Error eliminando episode:", error);
    } finally {
      // setSnackbarOpen(true);
      handleCloseDeleteConfirmation();
    }
  };

  /*********************************************************************** */
  if (isLoadingEpisodesData) return <Loading />;

  if (!episodesData.length) {
    console.info("No hay series aun");
  }

  console.log(episodesData);

  return (
    <>
      <Box>
        <SerieFilters />
        <AddButton
          handleOpenAddModal={handleOpenAddModal}
          message={"Add Episode"}
        ></AddButton>

        <ItemsList
          items={episodesData}
          CardComponent={EpisodeCard}
          handleDeleteElement={handleOpenDeleteConfirmation}
          handleOpenEditModal={handleOpenEditModal}
        ></ItemsList>

        <EpisodeFormModal
          handleCloseModal={handleCloseModal} //Manejador para cerrar el modal
          openModal={openModal} //Estado del modal
          selectedEpisodeToEdit={selectedEpisodeToEdit} //Enviar la serie actual
          onSubmit={handleSubmitEpisode} // Función para add/edit
          isLoading={isLoading} // Estado de carga
          temporadaId={temporadaId}
        ></EpisodeFormModal>
        <SubmitLoading
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          isSubmitting={isAdding || isDeleting || isUpdating}
          success={isAddSuccess || isDeleteSuccess || isUpdateSuccess}
          errorMessage={errorMessage}
          isEditing={!!selectedEpisodeToDelete}
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
              ¿Estás seguro de que deseas eliminar el episodio? Esta acción no
              se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteConfirmation} color="primary">
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmDeleteEpisode}
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
