import { Alert, LinearProgress, Slide, Snackbar } from "@mui/material";
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
      >
        {errorMessage ? (
          <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
            {errorMessage}
          </Alert>
        ) : success ? (
          <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
            {isEditing
              ? "Serie actualizada exitosamente"
              : "Serie creada exitosamente"}
          </Alert>
        ) : null}
      </Snackbar>
    </>
  );
};
