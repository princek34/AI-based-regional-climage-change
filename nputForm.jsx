// src/components/InputForm.jsx
// Climate feature input form with validation, grid layout, default values, and submit

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RotateCcw, Send, AlertCircle } from "lucide-react";
import useStore, { DEFAULT_INPUTS, FEATURE_RANGES } from "../context/store";
import usePrediction from "../hooks/usePrediction";

// Individual input field with label, unit, validation
const FeatureInput = ({ name, register, errors, range }) => {
  const error = errors[name];
  return (
    <div className={`input-group ${error ? "input-error" : ""}`}>
      <label htmlFor={name} className="input-label">
        <span className="label-text">{range.label}</span>
        <span className="label-unit">{range.unit}</span>
      </label>
      <input
        id={name}
        type="number"
        step="any"
        placeholder={String(DEFAULT_INPUTS[name])}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-err` : undefined}
        {...register(name, {
          required: "This field is required",
          valueAsNumber: true,
          min: { value: range.min, message: `Min value: ${range.min} ${range.unit}` },
          max: { value: range.max, message: `Max value: ${range.max} ${range.unit}` },
          validate: (v) => !isNaN(v) || "Must be a valid number",
        })}
        className="input-field"
      />
      {error && (
        <p id={`${name}-err`} className="input-error-msg" role="alert">
          <AlertCircle size={11} />
          {error.message}
        </p>
      )}
      <span className="input-range-hint">
        Range: {range.min} – {range.max}
      </span>
    </div>
  );
};

const InputForm = () => {
  const { inputs, setInput, resetInputs, isLoading } = useStore();
  const { predict } = usePrediction();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULT_INPUTS });

  // Keep form in sync when scenario is loaded
  useEffect(() => {
    reset(inputs);
  }, [inputs, reset]);

  const onSubmit = (data) => {
    // Sync validated form data into store then run prediction
    Object.entries(data).forEach(([k, v]) => setInput(k, v));
    predict(data);
  };

  const handleReset = () => {
    resetInputs();
    reset(DEFAULT_INPUTS);
  };

  return (
    <section className="card form-card" aria-label="Climate feature inputs">
      <div className="card-header">
        <h2 className="card-title">Environmental Features</h2>
        <p className="card-desc">
          Enter current environmental readings. All fields support decimals.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Climate prediction input form"
      >
        <div className="input-grid">
          {Object.entries(FEATURE_RANGES).map(([name, range]) => (
            <FeatureInput
              key={name}
              name={name}
              register={register}
              errors={errors}
              range={range}
            />
          ))}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
            aria-label="Reset all inputs to default values"
          >
            <RotateCcw size={15} />
            Reset to Defaults
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            aria-label="Submit form and get predictions"
          >
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Predicting…
              </>
            ) : (
              <>
                <Send size={15} />
                Predict Now
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};

export default InputForm;
