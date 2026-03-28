// src/components/ExplanationsPanel.jsx
// Hosts all three ExplanationChart components with shared toggle controls

import React from "react";
import { BarChart2, Percent, Hash } from "lucide-react";
import useStore from "../context/store";
import ExplanationChart from "./ExplanationChart";

const EXPLANATION_TARGETS = [
  { key: "temperature", title: "Temperature", unit: "°C", accentColor: "var(--orange)" },
  { key: "rainfall", title: "Rainfall", unit: "mm", accentColor: "var(--sky)" },
  { key: "co2", title: "CO₂ Level", unit: "ppm", accentColor: "var(--lime)" },
];

const ExplanationsPanel = () => {
  const { result, explanationMode, setExplanationMode } = useStore();
  if (!result) return null;

  return (
    <section className="explanations-section" aria-label="XAI explanations">
      {/* Section header with mode toggle */}
      <div className="explanations-header">
        <div className="section-title-group">
          <BarChart2 size={18} className="section-icon" aria-hidden="true" />
          <h2 className="section-title">
            <span className="title-accent">▶</span> Explainability (SHAP)
          </h2>
        </div>

        <div
          className="mode-toggle"
          role="group"
          aria-label="Explanation display mode"
        >
          <button
            className={`mode-btn ${explanationMode === "absolute" ? "active" : ""}`}
            onClick={() => setExplanationMode("absolute")}
            aria-pressed={explanationMode === "absolute"}
          >
            <Hash size={13} />
            Absolute
          </button>
          <button
            className={`mode-btn ${explanationMode === "percentage" ? "active" : ""}`}
            onClick={() => setExplanationMode("percentage")}
            aria-pressed={explanationMode === "percentage"}
          >
            <Percent size={13} />
            Percentage
          </button>
        </div>
      </div>

      <p className="explanations-desc">
        Each chart shows how much each input feature <em>contributed</em> to the prediction.
        <strong style={{ color: "var(--orange)" }}> Orange</strong> = pushes prediction higher.{" "}
        <strong style={{ color: "var(--sky)" }}>Blue</strong> = pushes prediction lower.
      </p>

      {/* Three explanation charts stacked */}
      <div className="explanation-charts-stack">
        {EXPLANATION_TARGETS.map((target) => (
          <ExplanationChart key={target.key} {...target} />
        ))}
      </div>
    </section>
  );
};

export default ExplanationsPanel;
