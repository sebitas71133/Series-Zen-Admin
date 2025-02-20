import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const BreadcrumbsComponent = () => {
  const navigate = useNavigate();
  const { serieId, seasonId } = useParams(); // Obtener parámetros de la URL
  const breadcrumbs = [
    <Link
      key="home"
      underline="hover"
      color="inherit"
      onClick={() => navigate("/admin")}
      sx={{ cursor: "pointer" }}
    >
      Home
    </Link>,
    <Link
      key="series"
      underline="hover"
      color="inherit"
      onClick={() => navigate("/admin/series")}
      sx={{ cursor: "pointer" }}
    >
      Series
    </Link>,
    serieId ? (
      <Link
        key="serie-name"
        underline="hover"
        color="inherit"
        onClick={() => navigate(`/admin/series/${serieId}/temporadas`)}
        sx={{ cursor: "pointer" }}
      >
        Temporadas
      </Link>
    ) : null,
    seasonId ? (
      <Typography key="episodios" color="text.primary">
        Episodios
      </Typography>
    ) : null,
  ].filter(Boolean);

  return (
    <Stack spacing={2} mb={3}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="medium" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
};

export default BreadcrumbsComponent;
