import { Box, Button, Grid2, Typography } from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import React, { useEffect, useRef } from "react";

export const ImageUpload = ({
  message,
  currentImage,
  onImageChange,
  isAddingElement,
}) => {
  const fileInputRef = useRef(null);

  // ⏳ Cada vez que `currentImage` cambie, limpiamos el input file
  useEffect(() => {
    if (!currentImage && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [currentImage]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    onImageChange(file);
  };

  const handleRemove = () => {
    onImageChange(null);
    // fileInputRef.current.value = "";
  };

  return (
    <Grid2 container spacing={2} mt={2}>
      <Grid2 xs={12} sm={6}>
        <Box sx={{ textAlign: "center" }}>
          <Button
            component="label"
            variant="contained"
            disabled={isAddingElement}
            startIcon={<FileUploadIcon />}
          >
            {`Upload ${message}`}
            <input
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*"
              ref={fileInputRef}
            />
          </Button>

          {(currentImage || fileInputRef.current?.files[0]) && (
            <Box mt={2}>
              <Typography variant="subtitle2">{`${message} Preview:`}</Typography>
              <img
                src={
                  currentImage ||
                  URL.createObjectURL(fileInputRef.current.files[0])
                }
                alt={`${message} preview`}
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "8px",
                  marginTop: "8px",
                }}
              />
              <Button
                onClick={handleRemove}
                color="error"
                size="small"
                variant="outlined"
                sx={{ mt: 1 }}
              >
                Remove
              </Button>
            </Box>
          )}
        </Box>
      </Grid2>
    </Grid2>
  );
};
