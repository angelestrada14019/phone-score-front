
// Smartphone evaluation types

export interface SmartphoneInput {
  internal_storage: number; // in GB
  storage_ram: number; // in GB
  expandable_storage: number | "NA"; // in TB or "NA"
  primary_camera: string; // e.g. "108MP + 12MP + 5MP + 5MP"
  display: string; // e.g. "Full HD+ Dynamic AMOLED 2X"
  network: string; // e.g. "5G, 4G, 3G, 2G"
  battery: string; // in mAh
}

export interface SmartphoneEvaluation extends SmartphoneInput {
  id: string;
  overall_score: number; // 0-100
  performance_category: "HIGH" | "MID" | "LOW";
//   price_range: string; // e.g. "$300 - $400"
  user_recommendation: string;
  metrics: {
    gaming_potential: number; // 0-100
    battery_performance: number; // 0-100
    photography: number; // 0-100
    display_quality: number; // 0-100
  };
}
