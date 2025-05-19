
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { SmartphoneEvaluation } from "../api/types/smartphone";
import MetricRadarChart from "./MetricRadarChart";
import MetricBadge from "./MetricBadge";
import { Database, Image, Cpu, Battery, Wifi, TrendingUp, TrendingDown, CircleCheck, DollarSign } from "lucide-react";

interface SmartphoneCardProps {
  data: SmartphoneEvaluation;
  isNew?: boolean;
}

const SmartphoneCard: React.FC<SmartphoneCardProps> = ({ data, isNew = false }) => {
  // Helper function to get badge color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "LOW":
        return "bg-blue-100 text-blue-800";
      case "MID":
        return "bg-purple-100 text-purple-800";
      case "HIGH":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Helper function to get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "HIGH":
        return <TrendingUp className="h-4 w-4 mr-1" />;
      case "MID":
        return <CircleCheck className="h-4 w-4 mr-1" />;
      case "LOW":
        return <TrendingDown className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`card-hover overflow-hidden ${isNew ? "animate-fade-in border-brand-500 shadow-md" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">
            Smartphone {data.id}
          </CardTitle>
          <Badge className={`flex items-center ${getCategoryColor(data.performance_category)}`}>
            {getCategoryIcon(data.performance_category)}
            {data.performance_category}
          </Badge>
        </div>
        <CardDescription>
          {data.user_recommendation}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-4 pb-2">
        <div className="flex flex-col gap-6">
          {/* Overall Score */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Puntuación General</span>
              <span className="text-sm font-medium">{data.overall_score}/100</span>
            </div>
            <Progress value={data.overall_score} className="h-2" />
          </div>
          
          {/* Price Range */}
          {/* {data.price_range && (
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Rango de Precio Estimado: {data.price_range}</span>
            </div>
          )} */}
          
          {/* Key Specifications */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{data.internal_storage}GB</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{data.storage_ram}GB RAM</span>
            </div>
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-gray-500" />
              <span className="text-sm truncate" title={data.primary_camera}>{data.primary_camera}</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{data.battery} mAh</span>
            </div>
          </div>
          
          {/* Display & Network */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Pantalla:</span>
              <span className="text-xs">{data.display}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-gray-500" />
              <span className="text-xs">{data.network}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Almac. expandible:</span>
              <span className="text-xs">{data.expandable_storage === "NA" ? "No disponible" : `${data.expandable_storage} TB`}</span>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Métricas de rendimiento</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              <MetricBadge label="Gaming" value={data.metrics.gaming_potential} />
              <MetricBadge label="Batería" value={data.metrics.battery_performance} />
              <MetricBadge label="Fotografía" value={data.metrics.photography} />
              <MetricBadge label="Pantalla" value={data.metrics.display_quality} />
            </div>
            <MetricRadarChart metrics={data.metrics} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartphoneCard;
