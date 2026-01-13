export type BarChartData = {
  columnName: string;
  numericMetric: number;
};

export type ChartConfig = {
  chartType: string;
  groupBy: string;
  metric: string;
  valueColumn: string;
};
export type ChartBuilderProps = {
  columns: string[];
  onBuild: (config: ChartConfig) => void;
};