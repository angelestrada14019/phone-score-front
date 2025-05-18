
import React from "react";
import { ChartBar } from "lucide-react";

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b">
      <div className="flex items-center space-x-3">
        <div className="bg-brand-500 p-2 rounded-lg">
          <ChartBar className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Smart Analytics</h1>
          <p className="text-muted-foreground">Evaluador de smartphones basado en ML</p>
        </div>
      </div>
      <div className="hidden sm:flex items-center space-x-2">
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">En Línea</span>
        <span className="text-sm text-muted-foreground">Modelo v1.0</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
