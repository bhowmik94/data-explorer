import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ChartData } from "../dtos/dashboard";

type BarChartProps = {
  data: ChartData[];
  xAxisKey: string;
  barKey: string;
  color: string;
};

export const DataBarChart = function ({ data, xAxisKey, barKey, color }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={barKey} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
};
