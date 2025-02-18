import { Grid2 } from "@mui/material";
import React from "react";
import { TemporadaCard } from "./TemporadaCard";

export const TemporadasList = ({
  temporadas,
  handleOpenEditModal,
  handleDeleteElement,
}) => {
  return (
    <Grid2 container spacing={3}>
      {temporadas.map((temporada) => (
        <TemporadaCard
          key={temporada.id}
          data={temporada}
          handleDeleteElement={handleDeleteElement}
          handleOpenEditModal={handleOpenEditModal}
        ></TemporadaCard>
      ))}
    </Grid2>
  );
};
