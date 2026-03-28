// src/components/Header.jsx
// Top navigation bar with project branding, model info toggle, and demo badge

import React from "react";
import { Brain, BookOpen, Info, GitCompare } from "lucide-react";
import useStore from "../context/store";
import { DEMO_MODE } from "../services/api";

const Header = () => {
  const { toggleModelInfo, toggleCompareMode, compareMode } = useStore();

  return (
    <header className="header">
      <div className="header-inner">
        {/* Brand */}
        <div className="brand">
          <div className="brand-icon">
            <Brain size={22} />
          </div>
          <div className="brand-text">
            <h1 className="brand-title">XAI Regional Climate Predictor</h1>
            <p className="brand-sub">
              Explainable AI for environmental forecasting
            </p>
          </div>
          {DEMO_MODE && (
            <span className="badge demo">DEMO MODE</span>
          )}
        </div>

        {/* Actions */}
        <nav className="header-actions" aria-label="Main navigation">
          <button
            className={`btn-ghost ${compareMode ? "active" : ""}`}
            onClick={toggleCompareMode}
            title="Compare two scenarios side by side"
            aria-pressed={compareMode}
          >
            <GitCompare size={16} />
            <span>Compare</span>
          </button>

          <button
            className="btn-ghost"
            onClick={toggleModelInfo}
            title="View model metadata"
          >
            <Info size={16} />
            <span>Model Info</span>
          </button>

          <a
            href="https://shap.readthedocs.io"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
            title="XAI methodology documentation"
          >
            <BookOpen size={16} />
            <span>Docs</span>
          </a>
        </nav>
      </div>

      {/* Subtitle bar */}
      <div className="header-tagline">
        <span>
          Predict <strong>Temperature</strong>, <strong>Rainfall</strong>, and{" "}
          <strong>CO₂</strong> levels — with transparent, feature-level explanations powered by SHAP.
        </span>
      </div>
    </header>
  );
};

export default Header;
