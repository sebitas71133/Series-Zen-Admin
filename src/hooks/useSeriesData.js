import { useEffect, useState } from "react";
import {
  useAddSerieMutation,
  useDeleteSerieMutation,
  useFetchSeriesQuery,
  useUpdateSerieMutation,
} from "../../services/seriesApi";

export const useSeriesData = () => {
  const { data, error } = useFetchSeriesQuery();
  const isLoading = !data && !error;
  const isError = !!error;

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const useAddSerie = () => {
  const [addSerie, { isLoading, isSuccess, isError, error }] =
    useAddSerieMutation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddSerie = async (newSerie) => {
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      // await addSerie(newSerie).unwrap();

      await delay(1000); // Simula una operación asíncrona
      setSuccess(true);
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleAddSerie,
    loading,
    success,
    errorMessage,
  };
};

//

export const useUpdateSerie = () => {
  const [updateSerie, { isLoading, isSuccess, isError, error }] =
    useUpdateSerieMutation();

  // const [loading, setLoading] = useState(false);
  // const [success, setSuccess] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateSerie = async (id, updatedSerie) => {
    // setLoading(true);
    // setSuccess(false);
    // setErrorMessage("");

    console.log({
      id,
      ...updatedSerie,
    });

    try {
      const result = await updateSerie({
        id,
        ...updatedSerie,
      }).unwrap();
      // await delay(1000);

      //   if (result.error) throw result.error;

      console.log("Serie actualizada: ", result);

      setSuccess(true);
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
      setSuccess(false);
    } finally {
      setLoading(false);
      console.log(success);
    }
  };

  return {
    handleUpdateSerie,
    loading,
    success,
    errorMessage,
  };
};

export const useDeleteSerie = () => {
  const [deleteSerie] = useDeleteSerieMutation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDeleteSerie = async (id) => {
    setLoading(true);
    setSuccess(false);
    setErrorMessage("");

    try {
      const result = await deleteSerie(id).unwrap();

      console.log("Serie eliminada:", result);

      setSuccess(true);
    } catch (err) {
      console.log(err);
      setErrorMessage(err);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleDeleteSerie,
    loading,
    success,
    errorMessage,
  };
};
