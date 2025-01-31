import { Alert, LinearProgress, Snackbar } from "@mui/material";
import React from "react";

export const SubmitLoading = ({
  open,
  onClose,
  errors,
  isSubmitting,
  success,
  errorMessage,
}) => {
  return (
    <>
      {isSubmitting && <LinearProgress />}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {Object.keys(errors).length > 0 ? (
          <Alert onClose={onClose} severity="error">
            Por favor, corrige los errores en el formulario.
          </Alert>
        ) : success ? (
          <Alert onClose={onClose} severity="success">
            Archivo subido exitosamente
          </Alert>
        ) : (
          <Alert onClose={onClose} severity="warning">
            El archivo no pudo subirse {errorMessage}
          </Alert>
        )}
      </Snackbar>
    </>
  );
};
