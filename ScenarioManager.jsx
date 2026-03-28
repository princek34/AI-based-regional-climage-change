// src/components/ScenarioManager.jsx
// Save, load, and delete named prediction scenarios stored in localStorage

import React, { useState } from "react";
import { Save, FolderOpen, Trash2, Clock } from "lucide-react";
import useStore from "../context/store";
import { formatDate } from "../utils/helpers";

const ScenarioManager = () => {
  const { result, scenarios, saveScenario, loadScenario, deleteScenario } = useStore();
  const [scenarioName, setScenarioName] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!scenarioName.trim() || !result) return;
    saveScenario(scenarioName.trim());
    setScenarioName("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="card scenario-card" aria-label="Scenario management">
      <div className="card-header">
        <h2 className="card-title">
          <FolderOpen size={16} /> Scenarios
        </h2>
        <p className="card-desc">Save and reload input + prediction combinations.</p>
      </div>

      {/* Save control */}
      {result && (
        <div className="scenario-save-row">
          <input
            type="text"
            className="input-field scenario-name-input"
            placeholder="Scenario name…"
            value={scenarioName}
            onChange={(e) => setScenarioName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            maxLength={40}
            aria-label="Scenario name"
          />
          <button
            className={`btn ${saved ? "btn-success" : "btn-secondary"}`}
            onClick={handleSave}
            disabled={!scenarioName.trim()}
            aria-label="Save current scenario"
          >
            <Save size={14} />
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      )}

      {/* Saved list */}
      {scenarios.length === 0 ? (
        <p className="scenario-empty">No saved scenarios yet. Run a prediction to save one.</p>
      ) : (
        <ul className="scenario-list" aria-label="Saved scenarios">
          {scenarios.map((s) => (
            <li key={s.id} className="scenario-item">
              <div className="scenario-info">
                <span className="scenario-name">{s.name}</span>
                <span className="scenario-date">
                  <Clock size={11} />
                  {formatDate(s.savedAt)}
                </span>
              </div>
              <div className="scenario-actions">
                <button
                  className="btn-icon"
                  onClick={() => loadScenario(s.id)}
                  title="Load this scenario"
                  aria-label={`Load scenario: ${s.name}`}
                >
                  <FolderOpen size={14} />
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => deleteScenario(s.id)}
                  title="Delete scenario"
                  aria-label={`Delete scenario: ${s.name}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default ScenarioManager;
