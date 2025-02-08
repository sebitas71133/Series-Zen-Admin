import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid2,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import React from "react";
import { SerieCard } from "./SerieCard";

const Icons = {
  Dashboard: () => "📊",
  Person: () => "👤",
  Product: () => "🛍️",
  Blog: () => "📝",
  SignIn: () => "🔑",
  Search: () => "🔍",
  Language: () => "🌐",
  Cart: () => "🛒",
  Edit: () => "✏️",
  Delete: () => "🗑️",
  Add: () => "➕",
  Close: () => "✖️",
  Star: () => "⭐",
};

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
