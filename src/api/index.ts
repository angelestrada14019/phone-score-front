
import axios from 'axios';
import { SmartphoneInput, SmartphoneEvaluation } from './types/smartphone';

// Base URL for the FastAPI backend
const API_BASE_URL = 'https://phone-score-api-production.up.railway.app';

// Function to evaluate a smartphone using the FastAPI backend
export async function evaluateSmartphone(
  input: SmartphoneInput
): Promise<SmartphoneEvaluation> {
  try {
    // Make API call to FastAPI backend
    const response = await axios.post<SmartphoneEvaluation>(
      `${API_BASE_URL}/smartphones/evaluate`,
      input
    );
    
    return response.data;
  } catch (error) {
    console.error('Error evaluating smartphone:', error);
    
    // If API call fails, fallback to local evaluation
    return generateLocalEvaluation(input);
  }
}

// Function to fetch sample smartphones from the FastAPI backend
export async function getSampleSmartphones(): Promise<SmartphoneInput[]> {
  try {
    const response = await axios.get<SmartphoneInput[]>(
      `${API_BASE_URL}/smartphones/samples`
    );
    
    return response.data;
  } catch (error) {
    console.error('Error fetching sample smartphones:', error);
    
    // Fallback to local sample data if API is not available
    return sampleSmartphones;
  }
}

// Fallback local evaluation function if API is not available
function generateLocalEvaluation(input: SmartphoneInput): SmartphoneEvaluation {
  // Generate a random ID
  const id = Math.random().toString(36).substring(2, 9);
  
  // Simulate ML model evaluation for smartphone category (HIGH, MID, LOW)
  // This simulates the my_model_gama model from sklearn
  const performanceCategory = simulateGamaModel(input);
  
  // Simulate ML model evaluation for price range
  // This simulates the my_model_price model from sklearn
//   const priceRange = simulatePriceModel(input);
  
  // Generate metrics based on the input
  const metrics = generateMetrics(input);
  
  // Calculate overall score based on the metrics
  const overallScore = Math.round(
    (metrics.gaming_potential * 0.2) +
    (metrics.battery_performance * 0.2) +
    (metrics.photography * 0.2) +
    (metrics.display_quality * 0.2)
  );
  
  // Generate user recommendation based on category and metrics
  const userRecommendation = generateUserRecommendation(performanceCategory, metrics);
  
  return {
    id,
    ...input,
    overall_score: overallScore,
    performance_category: performanceCategory,
    // price_range: priceRange,
    user_recommendation: userRecommendation,
    metrics
  };
}

// Function to simulate the my_model_gama model from sklearn
function simulateGamaModel(input: SmartphoneInput): "HIGH" | "MID" | "LOW" {
  // Calculate a weighted score based on specs
  const storageScore = (input.internal_storage / 512) * 100;
  const ramScore = (input.storage_ram / 16) * 100;
  
  // Calculate camera score based on MP values
  const cameras = input.primary_camera.split("+").map(c => {
    const digits = c.match(/\d+/);
    return digits ? parseInt(digits[0]) : 0;
  });
  const mpSum = cameras.reduce((sum, mp) => sum + mp, 0);
  const cameraScore = (mpSum / 200) * 100;
  
  // Calculate display score
  let displayScore = 0;
  if (input.display.toLowerCase().includes("amoled")) {
    displayScore = 90;
  } else if (input.display.toLowerCase().includes("oled")) {
    displayScore = 85;
  } else if (input.display.toLowerCase().includes("lcd")) {
    displayScore = 70;
  } else {
    displayScore = 60;
  }
  
  // Add bonus for resolution
  if (input.display.toLowerCase().includes("full hd") || input.display.toLowerCase().includes("1080p")) {
    displayScore += 5;
  } else if (input.display.toLowerCase().includes("2k") || input.display.toLowerCase().includes("1440p")) {
    displayScore += 8;
  } else if (input.display.toLowerCase().includes("4k")) {
    displayScore += 10;
  }
  
  // Calculate network score
  let networkScore = 0;
  if (input.network.toLowerCase().includes("5g")) {
    networkScore = 100;
  } else if (input.network.toLowerCase().includes("4g") || input.network.toLowerCase().includes("lte")) {
    networkScore = 80;
  } else {
    networkScore = 60;
  }
  
  // Calculate battery score
  const batteryScore = (input.battery / 6000) * 100;
  
  // Combined weighted score
  const combinedScore = 
    (storageScore * 0.15) +
    (ramScore * 0.25) +
    (cameraScore * 0.2) +
    (displayScore * 0.15) +
    (networkScore * 0.1) +
    (batteryScore * 0.15);
  
  // Determine category based on score
  if (combinedScore >= 80) {
    return "HIGH";
  } else if (combinedScore >= 60) {
    return "MID";
  } else {
    return "LOW";
  }
}

// // Function to simulate the my_model_price model from sklearn
// function simulatePriceModel(input: SmartphoneInput): string {
//   // Calculate a base price factor based on specs
//   const storageFactor = input.internal_storage * 0.5;
//   const ramFactor = input.storage_ram * 100;
  
//   // Camera factor
//   const cameras = input.primary_camera.split("+").map(c => {
//     const digits = c.match(/\d+/);
//     return digits ? parseInt(digits[0]) : 0;
//   });
//   const mpSum = cameras.reduce((sum, mp) => sum + mp, 0);
//   const cameraFactor = mpSum * 3;
  
//   // Display factor
//   let displayFactor = 100;
//   if (input.display.toLowerCase().includes("amoled")) {
//     displayFactor = 300;
//   } else if (input.display.toLowerCase().includes("oled")) {
//     displayFactor = 250;
//   } else if (input.display.toLowerCase().includes("lcd")) {
//     displayFactor = 150;
//   }
  
//   // Network factor
//   let networkFactor = 100;
//   if (input.network.toLowerCase().includes("5g")) {
//     networkFactor = 200;
//   }
  
//   // Battery factor
//   const batteryFactor = input.battery / 20;
  
//   // Base price (in USD)
//   const basePrice = 
//     storageFactor + 
//     ramFactor + 
//     cameraFactor + 
//     displayFactor + 
//     networkFactor + 
//     batteryFactor;
  
//   // Add some variability
//   const minPrice = Math.round(basePrice * 0.9);
//   const maxPrice = Math.round(basePrice * 1.1);
  
//   // Return price range in USD
//   return `$${minPrice} - $${maxPrice}`;
// }

// Generate detailed metrics based on smartphone specs
function generateMetrics(input: SmartphoneInput) {
  // Evaluate storage
  const storageScore = Math.min(100, (input.internal_storage / 512) * 100);
  
  // Evaluate RAM
  const ramScore = Math.min(100, (input.storage_ram / 16) * 100);
  
  // Evaluate camera
  const cameras = input.primary_camera.split("+").map(c => {
    const digits = c.match(/\d+/);
    return digits ? parseInt(digits[0]) : 0;
  });
  const mpSum = cameras.reduce((sum, mp) => sum + mp, 0);
  const cameraScore = Math.min(100, (mpSum / 200) * 100);
  
  // Evaluate display
  let displayScore = 0;
  if (input.display.toLowerCase().includes("amoled")) {
    displayScore = 90;
  } else if (input.display.toLowerCase().includes("oled")) {
    displayScore = 85;
  } else if (input.display.toLowerCase().includes("lcd")) {
    displayScore = 70;
  } else {
    displayScore = 60;
  }
  
  // Add bonus for resolution
  if (input.display.toLowerCase().includes("full hd") || input.display.toLowerCase().includes("1080p")) {
    displayScore += 5;
  } else if (input.display.toLowerCase().includes("2k") || input.display.toLowerCase().includes("1440p")) {
    displayScore += 8;
  } else if (input.display.toLowerCase().includes("4k")) {
    displayScore += 10;
  }
  
  displayScore = Math.min(100, displayScore);
  
  // Evaluate battery
  const batteryScore = Math.min(100, (input.battery / 6000) * 100);
  
  // Calculate gaming score
  const gamingPotential = Math.round((ramScore * 0.6) + (batteryScore * 0.2) + (storageScore * 0.2));
  
  
  return {
    gaming_potential: gamingPotential,
    battery_performance: Math.round(batteryScore),
    photography: Math.round(cameraScore),
    display_quality: Math.round(displayScore)
  };
}

// Generate user recommendation based on category and metrics
function generateUserRecommendation(category: string, metrics: any): string {
  if (category === "HIGH" && metrics.gaming_potential > 80) {
    return "Ideal para gaming intensivo y uso prolongado";
  } else if (category === "HIGH" && metrics.photography > 85) {
    return "Excelente para fotografía profesional y redes sociales";
  } else if (category === "MID" && metrics.battery_performance > 80) {
    return "Perfecto para usuarios que requieren larga duración de batería";
  } else if (category === "HIGH") {
    return "Recomendado para usuarios exigentes multipropósito";
  } else if (category === "MID") {
    return "Buen equilibrio para uso diario";
  } else {
    return "Adecuado para uso básico";
  }
}

// Sample data as fallback in case the API is not available
export const sampleSmartphones: SmartphoneInput[] = [
  {
    internal_storage: 256,
    storage_ram: 8,
    expandable_storage: 1,
    primary_camera: "108MP + 12MP + 5MP + 5MP",
    display: "Full HD+ Dynamic AMOLED 2X DisplayHD",
    network: "5G, 4G, 3G, 2G",
    battery: 5000
  },
  {
    internal_storage: 64,
    storage_ram: 8,
    expandable_storage: "NA",
    primary_camera: "50MP + 10MP + 12MP",
    display: "LCDHD",
    network: "4G, 3G, 2G",
    battery: 6000
  },
  {
    internal_storage: 100,
    storage_ram: 12,
    expandable_storage: 1,
    primary_camera: "108MP + 8MP + 2MP",
    display: "Full HD+ Super AMOLED Plus DisplayHD",
    network: "5G, 4G, 3G, 2G",
    battery: 4400
  }
];
