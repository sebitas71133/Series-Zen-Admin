import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";

import Drawer from "@mui/material/Drawer";

import List from "@mui/material/List";

import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useLogout } from "../../hooks/useLogout";
import { useSelector } from "react-redux";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function DrawerComponent(props) {
  const { handleDrawerClose, open, theme } = props;
  const { result } = useParams();
  const handleLogout = useLogout();

  const { email, loading } = useSelector((state) => state.session);

  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/admin/series", {
      replace: true,
    });
  };

  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography
            variant="h6"
            color="primary"
            sx={{
              flexGrow: 1,
              textAlign: "center",
              wordBreak: "break-word", // Permite que el texto se divida si es necesario
              overflowWrap: "break-word", // Asegura que el texto no se desborde
              whiteSpace: "normal", // Permite que el texto haga saltos de línea
              maxWidth: "100%", // Limita el ancho al contenedor
            }}
          >
            {email}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={handleHome}>
              <ListItemIcon>
                <HomeIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={"Home"}
                sx={{
                  color: "primary.main",
                  "&:hover": { color: "secondary.main" },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() =>
                window.open("https://github.com/sebitas71133", "_blank")
              }
            >
              <ListItemIcon>
                <GitHubIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={"Github"}
                sx={{
                  color: "primary.main",
                  "&:hover": { color: "secondary.main" },
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon color="secondary" />
              </ListItemIcon>
              <ListItemText
                primary={"Logout"}
                sx={{
                  color: "primary.main",
                  "&:hover": { color: "secondary.main" },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
