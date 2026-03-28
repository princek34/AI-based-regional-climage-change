// src/App.jsx
// Root component — composes the full application layout
// Left: Input form + Scenario manager
// Right: Results (prediction cards + explanations) + Export toolbar
// Overlay: Model info sidebar

import React from "react";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import PredictionCards from "./components/PredictionCards";
import ExplanationsPanel from "./components/ExplanationsPanel";
import ModelInfoSidebar from "./components/ModelInfoSidebar";
import ScenarioManager from "./components/ScenarioManager";
import ExportToolbar from "./components/ExportToolbar";
import { LoadingSkeleton, ErrorAlert } from "./components/LoadingAndError";
import useStore from "./context/store";
import "./styles.css";

const EmptyState = () => (
  <div className="empty-state" aria-label="No predictions yet">
    <div className="empty-icon" aria-hidden="true">🌍</div>
    <h3 className="empty-title">Ready to Predict</h3>
    <p className="empty-desc">
      Fill in the environmental feature values on the left and click{" "}
      <strong>Predict Now</strong> to see AI-powered forecasts with full SHAP explanations.
    </p>
    <ul className="empty-features" aria-label="What you'll see">
      <li>🌡️ Temperature forecast (°C)</li>
      <li>🌧️ Rainfall prediction (mm)</li>
      <li>💨 CO₂ level estimate (ppm)</li>
      <li>📊 SHAP feature contributions per prediction</li>
    </ul>
  </div>
);

const App = () => {
  const { result, isLoading, error } = useStore();

  return (
    <div className="app-root">
      <Header />

      <main className="app-main" id="main-content">
        {/* Left column: inputs + scenarios */}
        <aside className="left-panel" aria-label="Inputs and controls">
          <InputForm />
          <ScenarioManager />
        </aside>

        {/* Right column: results + explanations */}
        <section className="right-panel" aria-label="Prediction results and explanations">
          {error && <ErrorAlert />}

          {isLoading ? (
            <LoadingSkeleton />
          ) : result ? (
            <>
              <ExportToolbar />
              <div id="results-panel">
                <PredictionCards />
                <ExplanationsPanel />
              </div>
            </>
          ) : (
            <EmptyState />
          )}
        </section>
      </main>

      {/* Global overlay sidebar */}
      <ModelInfoSidebar />

      <footer className="app-footer">
        <p>
          Climate XAI Predictor — built with React + Recharts + SHAP.{" "}
          <a href="https://shap.readthedocs.io" target="_blank" rel="noopener noreferrer">
            Learn about SHAP →
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
