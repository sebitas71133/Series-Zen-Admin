import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../config/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const LoginDemoPage = () => {
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
          <Typography variant="h4" color="primary">
            Email : demo@zen.com
          </Typography>
          <Typography variant="h4" color="secondary">
            Password : 1234
          </Typography>
        </Box>
        <Auth
          supabaseClient={supabase}
          providers={[]}
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

export default LoginDemoPage;
