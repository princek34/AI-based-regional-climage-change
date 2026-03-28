// src/components/ExplanationChart.jsx
// SHAP-style feature contribution bar chart for a single prediction target
// Supports absolute vs percentage mode, collapsible, and tooltips

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import useStore from "../context/store";
import {
  sortByMagnitude,
  toAbsolute,
  toPercentages,
  truncateLabel,
  contributionColor,
} from "../utils/helpers";

// Custom tooltip component shown on bar hover
const CustomTooltip = ({ active, payload, unit, mode }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const val = d.displayValue;
  const direction = val >= 0 ? "increases" : "decreases";
  const amount = Math.abs(val).toFixed(mode === "percentage" ? 1 : 3);
  const displayUnit = mode === "percentage" ? "%" : unit;

  return (
    <div className="chart-tooltip" role="tooltip">
      <p className="tooltip-feature">{d.label}</p>
      <p className="tooltip-value" style={{ color: contributionColor(val) }}>
        {val >= 0 ? "+" : ""}
        {amount}
        {displayUnit}
      </p>
      <p className="tooltip-desc">
        This feature <strong>{direction}</strong> the prediction by{" "}
        <strong>
          {amount}
          {displayUnit}
        </strong>
        .
      </p>
    </div>
  );
};

// Top-K summary list
const TopFeaturesSummary = ({ contributions, unit, mode }) => {
  const top3 = contributions.slice(0, 3);
  return (
    <ul className="top-features" aria-label="Top contributing features">
      {top3.map((c) => {
        const val = c.displayValue;
        const sign = val >= 0 ? "+" : "";
        const displayUnit = mode === "percentage" ? "%" : unit;
        return (
          <li key={c.feature} className="top-feature-item">
            <span
              className="top-feature-dot"
              style={{ background: contributionColor(val) }}
              aria-hidden="true"
            />
            <span className="top-feature-label">{c.label}</span>
            <span
              className="top-feature-val"
              style={{ color: contributionColor(val) }}
            >
              {sign}
              {Math.abs(val).toFixed(mode === "percentage" ? 1 : 3)}
              {displayUnit}
            </span>
          </li>
        );
      })}
    </ul>
  );
};

const ExplanationChart = ({ targetKey, title, unit, accentColor }) => {
  const { result, explanationMode } = useStore();
  const [collapsed, setCollapsed] = useState(false);

  if (!result?.explanations?.[targetKey]) return null;

  const raw = result.explanations[targetKey];
  const sorted = sortByMagnitude(raw);
  const processed =
    explanationMode === "percentage" ? toPercentages(sorted) : toAbsolute(sorted);
  const displayUnit = explanationMode === "percentage" ? "%" : unit;

  return (
    <section
      className="explanation-panel"
      style={{ "--panel-accent": accentColor }}
      aria-label={`${title} feature explanations`}
    >
      {/* Panel header */}
      <div className="ep-header">
        <div className="ep-title-group">
          <span className="ep-dot" aria-hidden="true" />
          <h3 className="ep-title">{title} — Feature Contributions</h3>
          <button
            className="info-btn"
            title="These values represent SHAP contributions — how much each feature pushed the prediction above or below baseline."
            aria-label="Explanation methodology info"
          >
            <Info size={13} />
          </button>
        </div>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-controls={`ep-body-${targetKey}`}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>

      {!collapsed && (
        <div id={`ep-body-${targetKey}`} className="ep-body">
          {/* Top features summary */}
          <TopFeaturesSummary
            contributions={processed}
            unit={unit}
            mode={explanationMode}
          />

          {/* Bar chart */}
          <div className="chart-scroll-container" tabIndex={0} aria-label="Feature contribution bar chart">
            <ResponsiveContainer width="100%" height={Math.max(processed.length * 42, 200)}>
              <BarChart
                data={processed}
                layout="vertical"
                margin={{ top: 4, right: 60, left: 12, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  type="number"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                  tickFormatter={(v) => `${v > 0 ? "+" : ""}${v.toFixed(1)}${displayUnit}`}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={130}
                  tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => truncateLabel(v)}
                />
                <Tooltip
                  content={<CustomTooltip unit={unit} mode={explanationMode} />}
                  cursor={{ fill: "rgba(255,255,255,0.04)" }}
                />
                <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
                <Bar dataKey="displayValue" radius={[0, 4, 4, 0]} maxBarSize={22}>
                  {processed.map((entry) => (
                    <Cell
                      key={entry.feature}
                      fill={contributionColor(entry.displayValue)}
                      opacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="chart-legend" aria-label="Chart color legend">
            <span className="legend-item positive">
              <span className="legend-swatch" aria-hidden="true" />
              Positive contribution
            </span>
            <span className="legend-item negative">
              <span className="legend-swatch" aria-hidden="true" />
              Negative contribution
            </span>
          </div>
        </div>
      )}
    </section>
  );
};

export default ExplanationChart;
