import { Image } from "@mui/icons-material";
import { Box, Button, CardMedia, Container, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("background.jpg")`,
        backgroundSize: "cover", // Asegura que la imagen cubra todo el fondo
        backgroundPosition: "center", // Centra la imagen
        backgroundRepeat: "no-repeat", // Evita que la imagen se repita
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          zIndex: 10,
          flexDirection: { xs: "column", sm: "row" },
          backgroundColor: "black",
        }}
      >
        <CardMedia
          component="img"
          image={"serieszen_recorted.png"}
          alt={"zen"}
          sx={{
            maxWidth: 80,
            borderRadius: 2,
            display: { xs: "none", sm: "block" },
          }}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <Link to={"login"}>
            <Button
              variant="outlined"
              color="primary"
              sx={{
                "&:hover": {
                  backgroundColor: "text.secondary",
                  color: "black",
                },
                fontSize: "1rem",
              }}
            >
              INGRESA
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              // backgroundColor: "#0F0FFF",
              // color: "white",
              // "&:hover": {
              //   backgroundColor: "#0000DD",
              // },

              "&:hover": {
                backgroundColor: "text.secondary",
                color: "black",
              },
              padding: "0.5rem 2rem",
              // fontSize: "1rem",
              color: "text.primary",
            }}
          >
            SUSCRÍBETE AHORA
          </Button>
        </Box>
      </Box>
      {/* -------------------------------------- */}
      {/* Main Content */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
          padding: "20px",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CardMedia
            component="img"
            image={"serieszen_recorted.png"}
            alt={"zen"}
            sx={{ maxWidth: 250, borderRadius: 2 }}
          />
          <Typography variant="h4" component="h1">
            MUCHO MÁS QUE VER
          </Typography>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Planos a partir de S/.23,90 / mes
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              // backgroundColor: "background.paper",
              // color: "white",
              "&:hover": {
                backgroundColor: "text.secondary",
                color: "black",
              },
              padding: "0.5rem 2rem",
              fontSize: "1.2rem",
              color: "text.primary",
            }}
          >
            SUSCRÍBETE AHORA
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

{
  /* <Box sx={{ textAlign: "center", padding: "2rem" }}>
      <Typography variant="h2">Bienvenido a MySeriesApp</Typography>
      <Typography variant="subtitle1">
        Explora tus series favoritas, organiza episodios y más.
      </Typography>
      <Box sx={{ marginTop: "1rem" }}>
        <Link to="/login">
          <Button variant="contained" color="primary">
            Iniciar Sesión
          </Button>
        </Link>
        <Link to="/register" style={{ marginLeft: "1rem" }}>
          <Button variant="outlined" color="secondary">
            Registrarse
          </Button>
        </Link>
      </Box>
    </Box> */
}
