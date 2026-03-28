// src/utils/helpers.js
// Shared utility functions across components

/**
 * Formats a number for display with fixed decimal places
 */
export const formatValue = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return "—";
  return Number(value).toFixed(decimals);
};

/**
 * Converts raw SHAP contribution values to percentage of total absolute sum
 */
export const toPercentages = (contributions) => {
  const total = contributions.reduce((sum, c) => sum + Math.abs(c.contribution), 0);
  if (total === 0) return contributions.map((c) => ({ ...c, displayValue: 0 }));
  return contributions.map((c) => ({
    ...c,
    displayValue: +((c.contribution / total) * 100).toFixed(2),
  }));
};

/**
 * Adds absolute display values (just mirrors contribution)
 */
export const toAbsolute = (contributions) =>
  contributions.map((c) => ({ ...c, displayValue: c.contribution }));

/**
 * Sorts contributions by absolute magnitude (largest first)
 */
export const sortByMagnitude = (contributions) =>
  [...contributions].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

/**
 * Returns a color token based on positive/negative value
 */
export const contributionColor = (value) =>
  value >= 0 ? "#f97316" : "#38bdf8"; // orange-500 / sky-400

/**
 * Truncates a label to a max length
 */
export const truncateLabel = (label, maxLen = 18) =>
  label.length > maxLen ? label.slice(0, maxLen - 1) + "…" : label;

/**
 * Exports the current results as a simple JSON file download
 */
export const exportAsJSON = (result, inputs) => {
  const data = { inputs, ...result, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `climate_xai_${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Exports the result panel as PNG using html2canvas
 */
export const exportAsPNG = async (elementId) => {
  try {
    const html2canvas = (await import("html2canvas")).default;
    const element = document.getElementById(elementId);
    if (!element) return;
    const canvas = await html2canvas(element, { backgroundColor: "#0f172a", scale: 2 });
    const link = document.createElement("a");
    link.download = `climate_xai_report_${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("PNG export failed:", err);
  }
};

/**
 * Returns a human-readable label for a prediction type
 */
export const predictionMeta = {
  temperature: { label: "Temperature", unit: "°C", icon: "🌡️", color: "#f97316" },
  rainfall: { label: "Rainfall", unit: "mm", icon: "🌧️", color: "#38bdf8" },
  co2: { label: "CO₂ Level", unit: "ppm", icon: "💨", color: "#a3e635" },
};

/**
 * Clamps a value between min and max
 */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * Formats ISO date string to readable format
 */
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });