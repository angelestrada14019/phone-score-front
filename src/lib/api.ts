
import { SmartphoneInput, SmartphoneEvaluation } from "../api/types/smartphone";
import axios from "axios";

const API_URL = 'http://localhost:8000';

// API function to evaluate smartphone using the backend ML model
export async function evaluateSmartphone(
  input: SmartphoneInput
): Promise<SmartphoneEvaluation> {
  try {
    console.log("Sending data to API:", input);
    const response = await axios.post(`${API_URL}/smartphones/evaluate`, input);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error calling API, falling back to local evaluation:", error);
    return localEvaluateSmartphone(input);
  }
}

// Mock API function to use as fallback when API is unavailable
async function localEvaluateSmartphone(
  input: SmartphoneInput
): Promise<SmartphoneEvaluation> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 9);

  // Evaluate storage
  const storageScore = Math.min(100, (input.internal_storage / 512) * 100);
  
  // Evaluate RAM
  const ramScore = Math.min(100, (input.storage_ram / 16) * 100);
  
  // Evaluate camera (based on number of lenses and MPs)
  const cameras = input.primary_camera.split("+").map(c => {
    // Extract only numbers from string
    const digitsOnly = c.trim().match(/\d+/);
    return digitsOnly ? parseInt(digitsOnly[0]) : 0;
  });
  const mpSum = cameras.reduce((sum, mp) => sum + (isNaN(mp) ? 0 : mp), 0);
  const cameraScore = Math.min(100, (mpSum / 200) * 100);
  
  // Evaluate display
  const displayScore = 
    input.display.toLowerCase().includes("amoled") ? 90 : 
    input.display.toLowerCase().includes("lcd") ? 70 : 
    80;
  
  // Evaluate network
  const networkScore = 
    input.network.toLowerCase().includes("5g") ? 100 : 
    input.network.toLowerCase().includes("4g") ? 80 : 
    60;
  
  // Evaluate battery
  const batteryScore = Math.min(100, (parseInt(input.battery.toString().replace(/\D/g, '')) / 6000) * 100);

  // Calculate overall score
  const overall_score = Math.round(
    (storageScore * 0.15) + 
    (ramScore * 0.25) + 
    (cameraScore * 0.2) + 
    (displayScore * 0.15) + 
    (networkScore * 0.1) + 
    (batteryScore * 0.15)
  );

  // Determine performance category
  let performance_category: "HIGH" | "MID" | "LOW";
  if (overall_score < 60) {
    performance_category = "LOW";
  } else if (overall_score < 80) {
    performance_category = "MID";
  } else {
    performance_category = "HIGH";
  }

  // Generate user recommendation
  let user_recommendation = "";
  if (ramScore > 80 && batteryScore > 70) {
    user_recommendation = "Ideal para gaming intensivo y uso prolongado";
  } else if (cameraScore > 80) {
    user_recommendation = "Excelente para fotografía y redes sociales";
  } else if (batteryScore > 80) {
    user_recommendation = "Perfecto para usuarios que requieren larga duración de batería";
  } else if (overall_score > 80) {
    user_recommendation = "Recomendado para usuarios exigentes multipropósito";
  } else if (overall_score > 60) {
    user_recommendation = "Buen equilibrio para uso diario";
  } else {
    user_recommendation = "Adecuado para uso básico";
  }

  // Calculate price estimation
//   const base_price = (
//     input.internal_storage * 0.5 + 
//     input.storage_ram * 100 + 
//     mpSum * 3 + 
//     (input.display.toLowerCase().includes("amoled") ? 300 : 
//      input.display.toLowerCase().includes("oled") ? 250 : 
//      input.display.toLowerCase().includes("lcd") ? 150 : 100) + 
//     (input.network.toLowerCase().includes("5g") ? 200 : 100) + 
//     input.battery / 20
//   );
  
//   const min_price = Math.round(base_price * 0.9);
//   const max_price = Math.round(base_price * 1.1);
//   const price_range = `$${min_price} - $${max_price}`;

  // Generate specific metrics
  const gaming_potential = Math.round((ramScore * 0.6) + (batteryScore * 0.2) + (storageScore * 0.2));
  const battery_performance = Math.round(batteryScore);

  const photography = Math.round(cameraScore);
  const display_quality = Math.round(displayScore);

  return {
    id,
    ...input,
    overall_score,
    performance_category,
    // price_range,
    user_recommendation,
    metrics: {
      gaming_potential,
      battery_performance,
      photography,
      display_quality,
    },
  };
}

export const sampleSmartphones: SmartphoneInput[] = [
  {
    internal_storage: 256,
    storage_ram: 8,
    expandable_storage: 1,
    primary_camera: "108MP + 12MP + 5MP + 5MP",
    display: "Full HD+ Dynamic AMOLED 2X DisplayHD",
    network: "5G, 4G, 3G, 2G",
    battery: "5000 mAh"
  },
  {
    internal_storage: 64,
    storage_ram: 8,
    expandable_storage: null,
    primary_camera: "50MP + 10MP + 12MP",
    display: "LCDHD",
    network: "4G, 3G, 2G",
    battery: "6000 mAh"
  },
  {
    internal_storage: 100,
    storage_ram: 12,
    expandable_storage: 1,
    primary_camera: "108MP + 8MP + 2MP",
    display: "Full HD+ Super AMOLED Plus DisplayHD",
    network: "5G, 4G, 3G, 2G",
    battery: "4400 mAh"
  }
];
