// src/components/ExportToolbar.jsx
// Toolbar with export options: PNG screenshot and JSON data download

import React, { useState } from "react";
import { Download, FileJson, Image } from "lucide-react";
import useStore from "../context/store";
import { exportAsJSON, exportAsPNG } from "../utils/helpers";

const ExportToolbar = () => {
  const { result, inputs } = useStore();
  const [exporting, setExporting] = useState(null);

  if (!result) return null;

  const handlePNG = async () => {
    setExporting("png");
    await exportAsPNG("results-panel");
    setExporting(null);
  };

  const handleJSON = () => {
    setExporting("json");
    exportAsJSON(result, inputs);
    setTimeout(() => setExporting(null), 800);
  };

  return (
    <div className="export-toolbar" role="toolbar" aria-label="Export options">
      <span className="export-label">
        <Download size={13} /> Export
      </span>
      <button
        className="btn btn-export"
        onClick={handlePNG}
        disabled={exporting !== null}
        aria-label="Export results as PNG image"
        title="Screenshot the results panel as PNG"
      >
        <Image size={13} />
        {exporting === "png" ? "Capturing…" : "PNG"}
      </button>
      <button
        className="btn btn-export"
        onClick={handleJSON}
        disabled={exporting !== null}
        aria-label="Export results as JSON file"
        title="Download predictions and explanations as JSON"
      >
        <FileJson size={13} />
        {exporting === "json" ? "Saving…" : "JSON"}
      </button>
    </div>
  );
};

export default ExportToolbar;
