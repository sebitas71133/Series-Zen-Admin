import { Alert, LinearProgress, Snackbar } from "@mui/material";
import React from "react";

export const SubmitLoading = ({ open, onClose, errors, isSubmitting }) => {
  return (
    <>
      {isSubmitting && <LinearProgress />}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {Object.keys(errors).length > 0 ? (
          <Alert onClose={onClose} severity="error">
            Por favor, corrige los errores en el formulario.
          </Alert>
        ) : (
          <Alert onClose={onClose} severity="success">
            Archivo subido exitosamente
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
