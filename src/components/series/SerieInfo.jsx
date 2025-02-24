import { Box, Typography } from "@mui/material";
import { Loading } from "../common/Loading";

const SerieInfo = ({ serie, isSuccess, isLoading }) => {
  // console.log({ serie, isSuccess, isLoading });

  if (isLoading) return <Loading />; // Evita renderizar si no hay datos

  if (!isSuccess || !serie) return null;

  return (
    <Box mb={3} p={4} boxShadow={3} borderRadius={2}>
      <Typography variant="h4" color="primary">
        {serie[0].title}
      </Typography>
      <Typography variant="h6" component="h2" color="secondary" mt={2}>
        {serie[0].description}
      </Typography>
      {/* Si tienes imagen de la serie[0] */}
      {serie[0].banner_image && (
        <img
          src={serie[0].banner_image}
          alt={serie[0].title}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            margin: "20px auto",
            display: "block",
          }}
        />
      )}
    </Box>
  );
};

export default SerieInfo;
