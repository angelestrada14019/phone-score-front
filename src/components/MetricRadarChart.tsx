
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";

interface MetricsProps {
  gaming_potential: number;
  battery_performance: number;
  cost_effectiveness: number;
  photography: number;
  display_quality: number;
}

interface MetricRadarChartProps {
  metrics: MetricsProps;
}

const MetricRadarChart: React.FC<MetricRadarChartProps> = ({ metrics }) => {
  // Convert the metrics object to array for recharts
  const data = [
    { subject: "Gaming", value: metrics.gaming_potential },
    { subject: "Batería", value: metrics.battery_performance },
    { subject: "Costo-Beneficio", value: metrics.cost_effectiveness },
    { subject: "Fotografía", value: metrics.photography },
    { subject: "Pantalla", value: metrics.display_quality },
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
          <Radar
            name="Métricas"
            dataKey="value"
            stroke="#0072ff"
            fill="#0072ff"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricRadarChart;
