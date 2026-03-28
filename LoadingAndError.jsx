// src/components/LoadingAndError.jsx
// Reusable loading skeleton cards and error alert component

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import useStore from "../context/store";

// Animated skeleton placeholder for prediction cards
export const LoadingSkeleton = () => (
  <section className="predictions-section" aria-label="Loading predictions" aria-live="polite">
    <h2 className="section-title">
      <span className="title-accent">▶</span> Prediction Results
    </h2>
    <div className="prediction-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} className="prediction-card skeleton-card" aria-hidden="true">
          <div className="skel skel-icon" />
          <div className="skel skel-title" />
          <div className="skel skel-value" />
          <div className="skel skel-bar" />
          <div className="skel skel-desc" />
        </div>
      ))}
    </div>

    <div className="skel-charts-stack">
      {[0, 1, 2].map((i) => (
        <div key={i} className="explanation-panel">
          <div className="ep-header">
            <div className="skel skel-title" />
          </div>
          <div className="skel skel-chart" />
        </div>
      ))}
    </div>
  </section>
);

// Error alert with retry option
export const ErrorAlert = () => {
  const { error, clearError } = useStore();
  if (!error) return null;

  return (
    <div className="error-alert" role="alert" aria-live="assertive">
      <AlertTriangle size={18} className="error-icon" aria-hidden="true" />
      <div className="error-body">
        <strong className="error-title">Prediction Failed</strong>
        <p className="error-msg">{error}</p>
      </div>
      <button
        className="btn-icon"
        onClick={clearError}
        aria-label="Dismiss error"
        title="Dismiss"
      >
        <RefreshCw size={15} />
      </button>
    </div>
  );
};
