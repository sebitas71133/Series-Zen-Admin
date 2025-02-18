import * as React from "react";
import { Box, useTheme, CssBaseline } from "@mui/material";

import AppBarComponent from "./components/AppBarComponent";
import DrawerComponent from "./components/DrawerComponent";
import MainComponent from "./components/MainComponent";

export const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Appbar */}
      <AppBarComponent
        handleDrawerOpen={handleDrawerOpen}
        open={open}
      ></AppBarComponent>

      {/* Sidebar */}
      <DrawerComponent
        handleDrawerClose={handleDrawerClose}
        open={open}
        theme={theme}
      ></DrawerComponent>

      {/* Main content */}

      <MainComponent open={open}></MainComponent>
    </Box>
  );
};
