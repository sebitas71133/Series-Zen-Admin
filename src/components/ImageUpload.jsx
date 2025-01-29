import {
  Alert,
  Box,
  Button,
  LinearProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export const ImageUpload = ({
  message,
  selectedFileImage,
  setSelectedFile,
  selectedSerie,
}) => {
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      console.warn("You must selected an valid file");
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Button color="primary" variant="contained" component="label">
        {`Select ${message}`}

        <input
          id="file-input"
          type="file"
          onChange={handleFileChange}
          hidden
          accept="image/*"
          ref={fileInputRef}
        />
        <FileUploadIcon />
      </Button>
      <Box>
        {selectedFileImage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/* Se muestra la imagen seleccionada actualmente o anteriormente */}
            <Typography variant="subtitle1">{`${message} preview: `}</Typography>
            <img
              src={
                selectedFileImage && selectedFileImage instanceof File
                  ? URL.createObjectURL(selectedFileImage) // Solo crear un objeto URL si es un archivo
                  : message === "Cover"
                  ? selectedSerie?.cover_image ||
                    "https://picsum.photos/200/300"
                  : selectedSerie?.banner_image ||
                    "https://picsum.photos/200/300"
              }
              alt={message === "Cover" ? "Cover Preview" : "Banner Preview"}
              style={{
                maxWidth: "100%",
                marginTop: 10,
                margin: "auto",
                borderRadius: "10px",
              }}
            />
            {/* Cancelar imagen elegida */}
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="secondary"
              sx={{ marginTop: 2 }}
            >
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};
