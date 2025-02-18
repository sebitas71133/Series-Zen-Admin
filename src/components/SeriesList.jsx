import { Grid2 } from "@mui/material";

import React from "react";
import { SerieCard } from "./SerieCard";

//Usamos memo para memorizar un componente funcional. Esto significa que el componente solo se renderizará si sus props cambian
const SeriesList = React.memo(
  ({ series, handleDeleteElement, handleOpenEditModal }) => {
    return (
      <Grid2 container spacing={3}>
        {series.map((serie) => (
          <SerieCard
            key={serie.id}
            data={serie}
            handleDeleteElement={handleDeleteElement}
            handleOpenEditModal={handleOpenEditModal}
          ></SerieCard>
        ))}
      </Grid2>
    );
  }
);

export default SeriesList;
