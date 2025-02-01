import { Box } from "@mui/material";

import { useCallback, useState } from "react";

import BreadcrumbsComponent from "../layout/components/BreadcrumbsComponent";

import SerieFilters from "../components/SerieFilters";

import AddButton from "../components/AddButton";
import SeriesList from "../components/SeriesList";

import { useSeriesData } from "../hooks/useSeriesData";
import { Loading } from "../components/Loading";
import { supabase } from "../../config/supabaseClient";
import { SeriesFormModal } from "../components/SeriesFormModal";

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
  const [selectedSerie, setSelectedSerie] = useState(null); //Serie actual para editar

  const {
    data: seriesData,
    error: errorSeriesData,
    isLoading: isLoadingSeriesData,
    isError: isErrorSeriesData,
  } = useSeriesData();

  //Cada vez que da click en añadir o editar
  const handleOpenModal = useCallback((serieData = null) => {
    setSelectedSerie(serieData); //Si recibe la data de la serie se tendra la serie actual
    console.log(serieData);
    setOpenModal(true); //Se establece el modal abierto o true
    console.log("HANDLE OPEN MODAL");
  }, []);

  //Cuando se cierra el modal
  const handleCloseModal = useCallback(() => {
    setSelectedSerie(null); // Seria actual se limpia
    setOpenModal(false); //Se establece el modal cerrado o false
    console.log("HANDLE CLOSE MODAL");
  }, []);

  const handleDeleteSeries = async (id) => {
    try {
      const { error } = await supabase.from("series").delete().eq("id", id);

      if (error) throw error;

      // Actualizar datos después de eliminar
      // const updatedSeries = seriesData.filter(serie => serie.id !== id);
      // setSeries(updatedSeries); // Si usas estado local
    } catch (error) {
      console.error("Error eliminando serie:", error);
    }
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
        <AddButton handleOpenModal={handleOpenModal}></AddButton>

        {/* LISTA - GRID DE SERIES */}

        <SeriesList
          series={seriesData} //Lista de series
          handleDeleteSeries={handleDeleteSeries} // Manejador para eliminar una serie
          handleOpenModal={handleOpenModal} // Manejador para abrir el modal en caso de editar serie
        ></SeriesList>

        {/* DIALOG - FORMULARIO PARA AGREGAR O EDITAR UNA SERIE */}

        <SeriesFormModal
          handleCloseModal={handleCloseModal} //Manejador para cerrar el modal
          openModal={openModal} //Estado del modal
          selectedSerie={selectedSerie} //Enviar la serie actual
        ></SeriesFormModal>
      </Box>
    </>
  );
}
