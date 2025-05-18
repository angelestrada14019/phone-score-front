
import React from "react";
import { cn } from "@/lib/utils";

interface MetricBadgeProps {
  label: string;
  value: number;
}

const MetricBadge: React.FC<MetricBadgeProps> = ({ label, value }) => {
  // Determine color based on the metric value
  const getColor = (value: number) => {
    if (value >= 80) return "bg-green-100 text-green-800 border-green-300";
    if (value >= 60) return "bg-blue-100 text-blue-800 border-blue-300";
    if (value >= 40) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  // Determine star rating based on value
  const getStarRating = (value: number) => {
    if (value >= 80) return "★★★★★";
    if (value >= 60) return "★★★★☆";
    if (value >= 40) return "★★★☆☆";
    if (value >= 20) return "★★☆☆☆";
    return "★☆☆☆☆";
  };

  // Format the value to handle potential non-integer values
  const displayValue = typeof value === 'number' ? Math.round(value) : value;

  return (
    <div 
      className={cn(
        "px-2 py-1 rounded-md text-xs font-medium border flex items-center gap-1",
        getColor(displayValue)
      )}
    >
      {label}: {displayValue} <span className="text-xs ml-1">{getStarRating(displayValue)}</span>
    </div>
  );
};

export default MetricBadge;
