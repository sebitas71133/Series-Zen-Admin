import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export const TemporadaCard = ({
  data: temporada,
  handleOpenEditModal,
  handleDeleteElement: handleConfirmDeleteTemporada,
}) => {
  const { serieId } = useParams();
  const navigate = useNavigate();
  const handleViewEpisodes = () => {
    navigate(`/admin/series/${serieId}/temporadas/${temporada.id}/episodios`);
  };

  return (
    <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
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
          image={temporada.poster_image}
          alt={temporada.season_number}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {temporada.season_number}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: "80px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
            }}
          >
            {temporada.description}
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
              {temporada.release_year}
            </Typography>
            {/* <Typography
              variant="body2"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <StarRateIcon color="warning" />
              <Box component={"span"}>{serie.rating?.toFixed(1)}</Box>
            </Typography> */}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              onClick={handleViewEpisodes}
              size="small"
              variant="outlined"
            >
              View Episodes
            </Button>
            <Button
              color="primary"
              size="small"
              onClick={() => handleOpenEditModal(temporada)}
            >
              <EditIcon /> Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleConfirmDeleteTemporada(temporada)}
            >
              <DeleteIcon /> Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid2>
  );
};
