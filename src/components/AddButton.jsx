import { Box, Button, Typography } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";

const AddButton = ({ handleOpenAddModal, message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
      }}
    >
      <Typography variant="h4" component="h1">
        Series ZeN
      </Typography>
      <Button
        variant="contained"
        sx={{ bgcolor: "primary.main", color: "white" }}
        onClick={() => handleOpenAddModal()}
      >
        <AddIcon /> {message}
      </Button>
    </Box>
  );
};

export default AddButton;
