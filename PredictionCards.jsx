// src/components/PredictionCards.jsx
// Displays the three predicted values as styled metric cards with animated reveal

import React from "react";
import { Thermometer, CloudRain, Wind } from "lucide-react";
import useStore from "../context/store";
import { formatValue } from "../utils/helpers";

const CARD_CONFIG = [
  {
    key: "temperature",
    label: "Temperature",
    unit: "°C",
    icon: Thermometer,
    color: "var(--orange)",
    glow: "rgba(249,115,22,0.18)",
    description: "Predicted ambient air temperature",
    thresholds: { low: 10, high: 35 },
    getStatus: (v) => (v > 35 ? "🔴 Extreme Heat" : v < 5 ? "🔵 Very Cold" : "🟢 Normal"),
  },
  {
    key: "rainfall",
    label: "Rainfall",
    unit: "mm",
    icon: CloudRain,
    color: "var(--sky)",
    glow: "rgba(56,189,248,0.18)",
    description: "Expected precipitation amount",
    thresholds: { low: 1, high: 50 },
    getStatus: (v) => (v > 50 ? "🔴 Heavy Rain" : v < 1 ? "🟡 Dry" : "🟢 Normal"),
  },
  {
    key: "co2",
    label: "CO₂ Level",
    unit: "ppm",
    icon: Wind,
    color: "var(--lime)",
    glow: "rgba(163,230,53,0.18)",
    description: "Atmospheric CO₂ concentration",
    thresholds: { low: 350, high: 450 },
    getStatus: (v) => (v > 450 ? "🔴 Elevated" : v < 350 ? "🟢 Low" : "🟡 Rising"),
  },
];

// Animated radial gauge using SVG
const GaugeBar = ({ value, min, max, color }) => {
  const pct = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  return (
    <div className="gauge-bar" aria-hidden="true" title={`${pct.toFixed(0)}% of range`}>
      <div className="gauge-track">
        <div
          className="gauge-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="gauge-pct">{pct.toFixed(0)}%</span>
    </div>
  );
};

const PredictionCard = ({ config, value, compareValue }) => {
  const Icon = config.icon;
  const delta = compareValue !== undefined ? value - compareValue : null;

  return (
    <article
      className="prediction-card"
      style={{ "--card-accent": config.color, "--card-glow": config.glow }}
      aria-label={`${config.label} prediction`}
    >
      <div className="pc-header">
        <div className="pc-icon" aria-hidden="true">
          <Icon size={20} />
        </div>
        <span className="pc-label">{config.label}</span>
        <span className="pc-status">{config.getStatus(value)}</span>
      </div>

      <div className="pc-value-row">
        <span className="pc-value">{formatValue(value, 1)}</span>
        <span className="pc-unit">{config.unit}</span>
        {delta !== null && (
          <span className={`pc-delta ${delta >= 0 ? "positive" : "negative"}`}>
            {delta >= 0 ? "▲" : "▼"} {Math.abs(delta).toFixed(2)}
          </span>
        )}
      </div>

      <GaugeBar
        value={value}
        min={config.thresholds.low - config.thresholds.low * 0.5}
        max={config.thresholds.high * 1.3}
        color={config.color}
      />

      <p className="pc-desc">{config.description}</p>
    </article>
  );
};

const PredictionCards = () => {
  const { result, compareResult } = useStore();
  if (!result) return null;

  return (
    <section
      className="predictions-section"
      aria-label="Prediction results"
      id="results-panel"
    >
      <h2 className="section-title">
        <span className="title-accent">▶</span> Prediction Results
      </h2>
      <div className="prediction-grid">
        {CARD_CONFIG.map((cfg) => (
          <PredictionCard
            key={cfg.key}
            config={cfg}
            value={result.predictions[cfg.key]}
            compareValue={compareResult?.predictions?.[cfg.key]}
          />
        ))}
      </div>
    </section>
  );
};

export default PredictionCards;
