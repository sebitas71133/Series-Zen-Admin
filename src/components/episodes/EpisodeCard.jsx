import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import YouTubeIcon from "@mui/icons-material/YouTube";
import React from "react";
import { useSelector } from "react-redux";

export const EpisodeCard = ({
  data: episode,
  handleOpenEditModal,
  handleDeleteElement: handleConfirmDeleteEpisode,
}) => {
  const { email, loading } = useSelector((state) => state.session);
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
          image={episode.thumbnail_image}
          alt={episode.title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div">
            {`${episode.episode_number}. ${episode.title} `}
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
            {episode.description}
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
              {episode.release_date}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Button
              color="primary"
              size="small"
              onClick={() => handleOpenEditModal(episode)}
            >
              <EditIcon /> Edit
            </Button>
            <Button
              onClick={() => window.open(episode.video_url, "_blank")}
              size="small"
              color="secondary"
            >
              <YouTubeIcon />
              View
            </Button>

            <Button
              size="small"
              color="error"
              onClick={() => handleConfirmDeleteEpisode(episode)}
              disabled={email === "demo@zen.com"}
            >
              <DeleteIcon /> Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid2>
  );
};
