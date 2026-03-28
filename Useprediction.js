// src/hooks/usePrediction.js
// Custom hook that wires form submission to API call and global state updates

import { useCallback } from "react";
import useStore from "../context/store";
import { fetchPrediction } from "../services/api";

const usePrediction = () => {
  const { inputs, setResult, setLoading, setError, clearError, compareMode, setCompareResult } =
    useStore();

  const predict = useCallback(
    async (overrideInputs) => {
      const data = overrideInputs || inputs;
      clearError();
      setLoading(true);
      try {
        const result = await fetchPrediction(data);
        if (compareMode) {
          setCompareResult(result, data);
        } else {
          setResult(result);
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [inputs, clearError, setLoading, setResult, setError, compareMode, setCompareResult]
  );

  return { predict };
};

export default usePrediction;