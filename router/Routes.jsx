import { createBrowserRouter } from "react-router-dom";

import { AdminLayout } from "../src/layout/AdminLayout";

import HomePage from "../src/pages/HomePage";
import PublicLayout from "../src/layout/PublicLayout";
import LoginPage from "../src/pages/LoginPage";
import ProtectedLayout from "../src/layout/ProtectedLayout";
import SeriesPage from "../src/pages/SeriesPage";
import { TemporadasPage } from "../src/pages/TemporadasPage";
import { EpisodePage } from "../src/pages/EpisodePage";
import ErrorBoundary from "../src/components/common/ErrorBoundary";
import NotFoundPage from "../src/components/common/NotFoundPage";
import LoginDemoPage from "../src/pages/LoginDemoPage";

const routes = [
  //RUTAS PUBLICAS
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage></HomePage> },
      { path: "login", element: <LoginPage></LoginPage> },
      { path: "loginDemo", element: <LoginDemoPage /> },
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
          { path: "series/:serieId/temporadas", element: <TemporadasPage /> },
          {
            path: "series/:serieId/temporadas/:seasonId/episodios",
            element: <EpisodePage />,
          },
        ],
      },
    ],
  },
  //RUTAS DEMO
  // {
  //   path: "/demo",
  //   element: <DemoLayout />,
  //   children: [
  //     { index: true, element: <SeriesPage /> },
  //     { path: "series", element: <SeriesPage /> }, //Se carga en `/admin/series`
  //     { path: "series/:serieId/temporadas", element: <TemporadasPage /> },
  //     {
  //       path: "series/:serieId/temporadas/:seasonId/episodios",
  //       element: <EpisodePage />,
  //     },
  //   ],
  // },

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
