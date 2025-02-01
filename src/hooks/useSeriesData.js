import { useState } from "react";
import {
  useAddSerieMutation,
  useFetchSeriesQuery,
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
      await addSerie(newSerie).unwrap();

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
