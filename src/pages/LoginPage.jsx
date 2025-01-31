import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../config/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const LoginPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box flexGrow={0}>
        <Box sx={{ mb: 5 }}>
          <Typography variant="body" color="text.primary">
            PAGINA DE LOGIN
          </Typography>
        </Box>
        <Auth
          supabaseClient={supabase}
          providers={["google", "facebook", "twitter"]}
          appearance={{
            theme: ThemeSupa,
          }}
        />
        <Link to="/">
          <Button variant="contained" color="primary">
            Regresar
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default LoginPage;
