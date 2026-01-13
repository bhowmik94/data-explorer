import type { BarChartData } from "../types/charts";

export const generateBarChartData = (rows: any[], groupBy: string): BarChartData[] => {
  const map: Record<string, number> = {};
  console.log(groupBy)
  rows.forEach((row) => {
    const type = row.data[groupBy]?? "Unknown";
    map[type] = (map[type] || 0) + 1;
  }); // { "A": 1, "B": 2 }

  // Mapping the above map object to array of objects
  return Object.entries(map).map(([columnName, numericMetric]) => ({
    columnName,
    numericMetric,
  })); // [ { columnName: "A", count: 1 }, { numericMetric: "B", count: 2 } ]
};
