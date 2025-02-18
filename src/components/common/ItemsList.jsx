import { Grid2 } from "@mui/material";
import React from "react";

export const ItemsList = ({
  items,
  CardComponent,
  handleOpenEditModal,
  handleDeleteElement,
}) => {
  return (
    <Grid2 container spacing={3}>
      {items.map((e) => (
        <CardComponent
          key={e.id}
          data={e}
          handleDeleteElement={handleDeleteElement}
          handleOpenEditModal={handleOpenEditModal}
        ></CardComponent>
      ))}
    </Grid2>
  );
};
