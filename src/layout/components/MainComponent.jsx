import * as React from "react";
import { styled } from "@mui/material/styles";

import { Outlet } from "react-router-dom";
import BreadcrumbsComponent from "./BreadcrumbsComponent";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    variants: [
      {
        props: ({ open }) => open,
        style: {
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
      },
    ],
  })
);

const MainComponent = (props) => {
  const { open } = props;
  return (
    <Main open={open}>
      <DrawerHeader />
      <BreadcrumbsComponent></BreadcrumbsComponent>
      <Outlet />
    </Main>
  );
};

export default MainComponent;
