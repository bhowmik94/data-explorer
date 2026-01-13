import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { BarChartData } from "../types/charts";

type BarChartProps = {
  data: BarChartData[];
  metric: string;
  xAxisKey: string;
  barKey: string;
  color: string;
};

export const DataBarChart = function ({ data, metric, xAxisKey, barKey, color }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={barKey} name={metric} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
};
