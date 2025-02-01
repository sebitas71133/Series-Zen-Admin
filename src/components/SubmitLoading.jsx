import { Alert, LinearProgress, Snackbar } from "@mui/material";
import React from "react";

export const SubmitLoading = ({
  open,
  onClose,
  isSubmitting,
  success,
  errorMessage,
  isEditing, // Nueva prop para saber si estamos editando
}) => {
  return (
    <>
      {isSubmitting && <LinearProgress />}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {errorMessage ? (
          <Alert onClose={onClose} severity="error">
            {errorMessage}
          </Alert>
        ) : success ? (
          <Alert onClose={onClose} severity="success">
            {isEditing
              ? "Serie actualizada exitosamente"
              : "Serie creada exitosamente"}
          </Alert>
        ) : null}
      </Snackbar>
    </>
  );
};
