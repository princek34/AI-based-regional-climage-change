// src/components/ModelInfoSidebar.jsx
// Collapsible sidebar panel showing model metadata (version, accuracy, algorithm)

import React from "react";
import { X, Cpu, Calendar, TrendingUp, Database } from "lucide-react";
import useStore from "../context/store";
import { formatDate } from "../utils/helpers";

const MetricRow = ({ label, value, color }) => (
  <div className="metric-row">
    <span className="metric-label">{label}</span>
    <span className="metric-value" style={{ color: color || "var(--text-primary)" }}>
      {value}
    </span>
  </div>
);

const R2Bar = ({ label, value }) => (
  <div className="r2-row">
    <span className="r2-label">{label}</span>
    <div className="r2-bar-track" aria-label={`R² ${value}`}>
      <div
        className="r2-bar-fill"
        style={{ width: `${value * 100}%` }}
        role="progressbar"
        aria-valuenow={value * 100}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
    <span className="r2-val">{(value * 100).toFixed(1)}%</span>
  </div>
);

const ModelInfoSidebar = () => {
  const { showModelInfo, toggleModelInfo, result } = useStore();
  const info = result?.model_info;

  if (!showModelInfo) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="sidebar-backdrop"
        onClick={toggleModelInfo}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className="model-sidebar"
        role="complementary"
        aria-label="Model information"
      >
        <div className="sidebar-header">
          <h2 className="sidebar-title">Model Information</h2>
          <button
            className="sidebar-close"
            onClick={toggleModelInfo}
            aria-label="Close model info sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {info ? (
          <div className="sidebar-body">
            {/* Identity */}
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">
                <Cpu size={14} /> Identity
              </h3>
              <MetricRow label="Algorithm" value={info.algorithm} />
              <MetricRow label="Version" value={info.version} color="var(--lime)" />
            </section>

            {/* Training */}
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">
                <Calendar size={14} /> Training
              </h3>
              <MetricRow
                label="Training Date"
                value={formatDate(info.training_date)}
              />
              <MetricRow label="Features" value="8 environmental inputs" />
              <MetricRow label="Outputs" value="Temperature, Rainfall, CO₂" />
            </section>

            {/* Accuracy */}
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">
                <TrendingUp size={14} /> R² Accuracy
              </h3>
              <R2Bar label="Temperature" value={info.r2_temperature} />
              <R2Bar label="Rainfall" value={info.r2_rainfall} />
              <R2Bar label="CO₂" value={info.r2_co2} />
            </section>

            {/* Explainability */}
            <section className="sidebar-section">
              <h3 className="sidebar-section-title">
                <Database size={14} /> Explainability
              </h3>
              <MetricRow label="XAI Method" value="SHAP TreeExplainer" />
              <MetricRow label="Scope" value="Local (per-prediction)" />
              <MetricRow label="Visualization" value="Waterfall / Bar Chart" />
            </section>

            <p className="sidebar-disclaimer">
              Model accuracy metrics are based on held-out test data. Predictions are
              estimates for research/educational purposes only.
            </p>
          </div>
        ) : (
          <div className="sidebar-empty">
            <p>Run a prediction first to load model metadata.</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default ModelInfoSidebar;
