import { Box } from "@mui/material";

import { useCallback, useState } from "react";

import BreadcrumbsComponent from "../layout/components/BreadcrumbsComponent";

import SerieFilters from "../components/SerieFilters";

import AddButton from "../components/AddButton";
import SeriesList from "../components/SeriesList";

import { useDeleteSerie, useSeriesData } from "../hooks/useSeriesData";
import { Loading } from "../components/Loading";
import { supabase } from "../../config/supabaseClient";
import { SeriesFormModal } from "../components/SeriesFormModal";
import { useEffect } from "react";
import {
  useAddSerieMutation,
  useDeleteSerieMutation,
  useFetchSeriesQuery,
  useUpdateSerieMutation,
} from "../../services/seriesApi";
import { SubmitLoading } from "../components/SubmitLoading";
import { deleteImageFromStorage } from "../utils/imageUtils";

// const initialSeries = [
//   {
//     id: 1,
//     title: "Samurai Jack",
//     cover_image:
//       "https://monlmedsqyxwyanwrhlp.supabase.co/storage/v1/object/public/SeriesZenMedia/SERIES/SAMURAI-JACK/SERIE/Series_Samurai_Jack_q7ax9j.jpg",
//     banner_image:
//       "https://monlmedsqyxwyanwrhlp.supabase.co/storage/v1/object/public/SeriesZenMedia/SERIES/SAMURAI-JACK/SERIE/Samuria-banner_iomi3u.avif",
//     description:
//       "Cuando una fuerza maligna destruye la Tierra, un joven guerrero samurái viaja al futuro. Los nativos lo ayudan a volver al pasado para prevenirlo.",
//     release_year: 2002,
//     rating: 8.5,
//     slug: "samurai-jack",
//   },
//   {
//     id: 2,
//     title: "Primal",
//     cover_image:
//       "https://monlmedsqyxwyanwrhlp.supabase.co/storage/v1/object/public/SeriesZenMedia/SERIES/PRIMAL/SERIE/primal_cover_image_bcl0af.jpg",
//     banner_image:
//       "https://monlmedsqyxwyanwrhlp.supabase.co/storage/v1/object/public/SeriesZenMedia/SERIES/PRIMAL/SERIE/primal_banner_image_isbuwd.jpg",
//     description:
//       "La historia de un cavernícola a punto de evolucionar y un dinosaurio al borde de la extinción. En la tragedia, su amistad se convierte en la esperanza para sobrevivir en un mundo violento y primitivo.",
//     release_year: 2019,
//     rating: 8.7,
//     slug: "primal",
//   },
// ];
export default function SeriesPage() {
  // const [series, setSeries] = useState(initialSeries);
  const [openModal, setOpenModal] = useState(false); //Modal para añadir o editar en formulario
  const [selectedSerieToEdit, setSelectedSerie] = useState(null); //Serie actual para editar
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
    console.log("handle open add serie", selectedSerieToEdit);
  }, []);

  const handleOpenEditModal = useCallback((serieData) => {
    setSelectedSerie(serieData);
    setOpenModal(true);
  }, []);

  //Cuando se cierra el modal
  const handleCloseModal = useCallback(() => {
    setOpenModal(false); //Se establece el modal cerrado o false
    console.log("HANDLE CLOSE MODAL", selectedSerieToEdit);
  }, []);

  const handleDeleteSerie = async (serie) => {
    const { id } = serie;
    // Eliminar imágenes asociadas
    if (serie.cover_image) {
      await deleteImageFromStorage(serie?.cover_image);
    }
    if (serie.banner_image) {
      await deleteImageFromStorage(serie?.banner_image);
    }

    try {
      await deleteSerie(id).unwrap();
      console.log("Eliminado serie con id:", id);
    } catch (error) {
      console.error("Error eliminando serie:", error);
    }
  };

  if (isLoadingSeriesData) return <Loading />;
  if (isErrorSeriesData) return <div>{errorSeriesData}</div>;

  console.log(seriesData);

  // useEffect(() => {
  //   console.log("Effect Cambio select serie : ", selectedSerieToEdit);
  // }, [selectedSerieToEdit]);

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
          handleDeleteElement={handleDeleteSerie} // Manejador para eliminar una serie
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
      </Box>
    </>
  );
}
