import { createBrowserRouter } from "react-router-dom";

import NotFoundPage from "../src/components/NotFoundPage";
import { AdminLayout } from "../src/layout/AdminLayout";
import ErrorBoundary from "../src/components/ErrorBoundary";

import HomePage from "../src/pages/HomePage";
import PublicLayout from "../src/layout/PublicLayout";
import LoginPage from "../src/pages/LoginPage";
import ProtectedLayout from "../src/layout/ProtectedLayout";

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
    path: "/app",
    element: <ProtectedLayout />,
    children: [
      { path: "series", element: <AdminLayout></AdminLayout> },
      //   { path: "series/:slug", element: <SeriesPage></SeriesPage> },
      //   { path: "profile", element: <Account></Account> },
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
