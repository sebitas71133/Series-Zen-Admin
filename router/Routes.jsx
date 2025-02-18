import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "../src/components/NotFoundPage";
import { AdminLayout } from "../src/layout/AdminLayout";
import ErrorBoundary from "../src/components/ErrorBoundary";

import HomePage from "../src/pages/HomePage";
import PublicLayout from "../src/layout/PublicLayout";
import LoginPage from "../src/pages/LoginPage";
import ProtectedLayout from "../src/layout/ProtectedLayout";
import SeriesPage from "../src/pages/SeriesPage";
import { TemporadasPage } from "../src/pages/TemporadasPage";
import { EpisodePage } from "../src/pages/EpisodePage";

const routes = [
  //RUTAS PUBLICAS
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage></HomePage> },
      { path: "login", element: <LoginPage></LoginPage> },
    ],
    errorBoundary: <ErrorBoundary />,
  },
  //RUTAS PRIVADA
  {
    path: "/admin",
    element: <ProtectedLayout />, // Se renderiza primero
    children: [
      {
        path: "",
        element: <AdminLayout></AdminLayout>,
        children: [
          { index: true, element: <SeriesPage /> }, // Se carga em `/admin`
          { path: "series", element: <SeriesPage /> }, //Se carga en `/admin/series`
          { path: "series/:slug/temporadas", element: <TemporadasPage /> },
          {
            path: "series/:slug/temporadas/:season_number/episodios",
            element: <EpisodePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
    v7_startTransition: true,
  },
});

export default router;
