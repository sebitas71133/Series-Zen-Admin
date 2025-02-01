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
  ({ series, handleDeleteSeries, handleOpenModal }) => {
    return (
      <Grid2 container spacing={3}>
        {series.map((serie) => (
          <Grid2 item size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={serie.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={serie.cover_image}
                alt={serie.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div">
                  {serie.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {serie.description}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    {serie.release_year}
                  </Typography>
                  <Typography variant="body2">
                    <Icons.Star /> {serie.rating?.toFixed(1)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <Button size="small" variant="outlined">
                    View Seasons
                  </Button>
                  <Button
                    color="primary"
                    size="small"
                    onClick={() => handleOpenModal(serie)}
                  >
                    <EditIcon /> Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteSeries(serie.id)}
                  >
                    <DeleteIcon /> Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    );
  }
);

export default SeriesList;
