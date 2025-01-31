import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";

import { AdminLayout } from "./layout/AdminLayout";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { RouterProvider } from "react-router-dom";
import router from "../router/Routes";
import UserProvider from "../providers/UserProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2065D1",
    },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <RouterProvider
            router={router}
            future={{
              v7_fetcherPersist: true,
              v7_startTransition: true,
            }}
          >
            {/* <AdminLayout></AdminLayout> */}
          </RouterProvider>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
