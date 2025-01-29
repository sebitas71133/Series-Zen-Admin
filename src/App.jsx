import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";

import { AdminLayout } from "./layout/AdminLayout";

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
    <ThemeProvider theme={theme}>
      <AdminLayout></AdminLayout>
    </ThemeProvider>
  );
}

export default App;
