// src/context/store.js
// Zustand store for global application state
// Manages: form inputs, prediction results, loading/error states, saved scenarios

import { create } from "zustand";

// Default input values for demonstration purposes
export const DEFAULT_INPUTS = {
  wind_speed: 4.2,
  humidity: 65,
  atmospheric_pressure: 1013.25,
  solar_radiation: 220,
  cloud_cover: 35,
  precipitation_lag: 6.5,
  temperature_lag: 22.0,
  co2_lag: 415.3,
};

// Reasonable validation ranges per feature
export const FEATURE_RANGES = {
  wind_speed: { min: 0, max: 120, unit: "m/s", label: "Wind Speed" },
  humidity: { min: 0, max: 100, unit: "%", label: "Humidity" },
  atmospheric_pressure: { min: 870, max: 1085, unit: "hPa", label: "Atmospheric Pressure" },
  solar_radiation: { min: 0, max: 1400, unit: "W/m²", label: "Solar Radiation" },
  cloud_cover: { min: 0, max: 100, unit: "%", label: "Cloud Cover" },
  precipitation_lag: { min: 0, max: 500, unit: "mm", label: "Precipitation (lag)" },
  temperature_lag: { min: -60, max: 60, unit: "°C", label: "Temperature (lag)" },
  co2_lag: { min: 280, max: 600, unit: "ppm", label: "CO₂ (lag)" },
};

const useStore = create((set, get) => ({
  // --- Input State ---
  inputs: { ...DEFAULT_INPUTS },
  setInput: (key, value) =>
    set((state) => ({ inputs: { ...state.inputs, [key]: value } })),
  resetInputs: () => set({ inputs: { ...DEFAULT_INPUTS } }),

  // --- Prediction Result State ---
  result: null,
  setResult: (result) => set({ result }),
  clearResult: () => set({ result: null }),

  // --- UI State ---
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // --- Explanation Display Mode (absolute vs percentage) ---
  explanationMode: "absolute", // "absolute" | "percentage"
  setExplanationMode: (mode) => set({ explanationMode: mode }),

  // --- Model Info Sidebar ---
  showModelInfo: false,
  toggleModelInfo: () => set((state) => ({ showModelInfo: !state.showModelInfo })),

  // --- Saved Scenarios ---
  scenarios: JSON.parse(localStorage.getItem("xai_scenarios") || "[]"),
  saveScenario: (name) => {
    const { inputs, result } = get();
    if (!result) return;
    const scenario = {
      id: Date.now(),
      name,
      inputs: { ...inputs },
      result,
      savedAt: new Date().toISOString(),
    };
    const updated = [...get().scenarios, scenario];
    localStorage.setItem("xai_scenarios", JSON.stringify(updated));
    set({ scenarios: updated });
  },
  loadScenario: (id) => {
    const scenario = get().scenarios.find((s) => s.id === id);
    if (scenario) {
      set({ inputs: { ...scenario.inputs }, result: scenario.result });
    }
  },
  deleteScenario: (id) => {
    const updated = get().scenarios.filter((s) => s.id !== id);
    localStorage.setItem("xai_scenarios", JSON.stringify(updated));
    set({ scenarios: updated });
  },

  // --- Comparison Mode ---
  compareMode: false,
  compareResult: null,
  compareInputs: null,
  toggleCompareMode: () => set((state) => ({ compareMode: !state.compareMode })),
  setCompareResult: (result, inputs) => set({ compareResult: result, compareInputs: inputs }),
}));

export default useStore;
