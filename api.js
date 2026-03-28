// src/services/api.js
// Handles all API communication with the backend prediction service
// Supports both live API calls and demo/mock mode for offline testing

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const DEMO_MODE = process.env.REACT_APP_DEMO_MODE === "true" || true; // default demo on

/**
 * Generates realistic mock predictions and SHAP-style explanations
 * for offline demonstration or development use.
 */
const generateMockResponse = (inputs) => {
  const wind = inputs.wind_speed || 5;
  const humidity = inputs.humidity || 60;
  const pressure = inputs.atmospheric_pressure || 1013;
  const solar = inputs.solar_radiation || 200;
  const cloud = inputs.cloud_cover || 30;
  const precipLag = inputs.precipitation_lag || 5;
  const tempLag = inputs.temperature_lag || 20;
  const co2Lag = inputs.co2_lag || 410;

  // Simulate prediction values based on inputs
  const temperature = +(
    tempLag * 0.7 +
    solar * 0.02 -
    cloud * 0.05 +
    humidity * 0.03 -
    wind * 0.2 +
    (Math.random() - 0.5) * 2
  ).toFixed(2);

  const rainfall = +(
    humidity * 0.15 +
    precipLag * 0.4 +
    cloud * 0.1 -
    pressure * 0.005 +
    (Math.random() - 0.5) * 3
  ).toFixed(2);

  const co2 = +(
    co2Lag * 0.95 +
    solar * 0.005 -
    wind * 0.1 +
    (Math.random() - 0.5) * 1.5
  ).toFixed(2);

  return {
    predictions: { temperature, rainfall, co2 },
    explanations: {
      temperature: [
        { feature: "temperature_lag", contribution: +(tempLag * 0.28).toFixed(3), label: "Temp (lag)" },
        { feature: "solar_radiation", contribution: +(solar * 0.018).toFixed(3), label: "Solar Radiation" },
        { feature: "humidity", contribution: +(humidity * 0.012).toFixed(3), label: "Humidity" },
        { feature: "wind_speed", contribution: +(-wind * 0.18).toFixed(3), label: "Wind Speed" },
        { feature: "cloud_cover", contribution: +(-cloud * 0.04).toFixed(3), label: "Cloud Cover" },
        { feature: "atmospheric_pressure", contribution: +((pressure - 1013) * 0.002).toFixed(3), label: "Atm. Pressure" },
        { feature: "precipitation_lag", contribution: +(-precipLag * 0.03).toFixed(3), label: "Precip. (lag)" },
        { feature: "co2_lag", contribution: +(co2Lag * 0.0001).toFixed(3), label: "CO₂ (lag)" },
      ],
      rainfall: [
        { feature: "humidity", contribution: +(humidity * 0.14).toFixed(3), label: "Humidity" },
        { feature: "precipitation_lag", contribution: +(precipLag * 0.38).toFixed(3), label: "Precip. (lag)" },
        { feature: "cloud_cover", contribution: +(cloud * 0.09).toFixed(3), label: "Cloud Cover" },
        { feature: "atmospheric_pressure", contribution: +(-pressure * 0.004).toFixed(3), label: "Atm. Pressure" },
        { feature: "wind_speed", contribution: +(wind * 0.05).toFixed(3), label: "Wind Speed" },
        { feature: "temperature_lag", contribution: +(-tempLag * 0.02).toFixed(3), label: "Temp (lag)" },
        { feature: "solar_radiation", contribution: +(-solar * 0.003).toFixed(3), label: "Solar Radiation" },
        { feature: "co2_lag", contribution: +(co2Lag * 0.00008).toFixed(3), label: "CO₂ (lag)" },
      ],
      co2: [
        { feature: "co2_lag", contribution: +(co2Lag * 0.91).toFixed(3), label: "CO₂ (lag)" },
        { feature: "solar_radiation", contribution: +(solar * 0.004).toFixed(3), label: "Solar Radiation" },
        { feature: "temperature_lag", contribution: +(tempLag * 0.015).toFixed(3), label: "Temp (lag)" },
        { feature: "wind_speed", contribution: +(-wind * 0.09).toFixed(3), label: "Wind Speed" },
        { feature: "humidity", contribution: +(humidity * 0.003).toFixed(3), label: "Humidity" },
        { feature: "cloud_cover", contribution: +(-cloud * 0.002).toFixed(3), label: "Cloud Cover" },
        { feature: "atmospheric_pressure", contribution: +((pressure - 1013) * 0.001).toFixed(3), label: "Atm. Pressure" },
        { feature: "precipitation_lag", contribution: +(-precipLag * 0.004).toFixed(3), label: "Precip. (lag)" },
      ],
    },
    model_info: {
      version: "v2.1.4",
      training_date: "2024-11-15",
      r2_temperature: 0.923,
      r2_rainfall: 0.871,
      r2_co2: 0.988,
      algorithm: "Gradient Boosted Trees (XGBoost)",
    },
  };
};

/**
 * Sends input features to the backend and returns predictions + XAI explanations.
 * Falls back to mock data if DEMO_MODE is enabled or the API is unreachable.
 * @param {Object} inputs - Feature key-value pairs
 * @returns {Object} { predictions, explanations, model_info }
 */
export const fetchPrediction = async (inputs) => {
  if (DEMO_MODE) {
    // Simulate network latency for realistic demo experience
    await new Promise((res) => setTimeout(res, 1400));
    return generateMockResponse(inputs);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inputs),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Network errors: fallback to mock in development
    if (process.env.NODE_ENV === "development") {
      console.warn("API unreachable, using mock data:", error.message);
      await new Promise((res) => setTimeout(res, 800));
      return generateMockResponse(inputs);
    }
    throw error;
  }
};

export { DEMO_MODE };
