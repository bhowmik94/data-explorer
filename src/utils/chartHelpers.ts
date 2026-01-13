import type { BarChartData } from "../types/charts";

export const generateBarChartData = (
  rows: any[],
  groupBy: string,
  metric: string,
  valueColumn: string
): BarChartData[] => {
  const map: Record<string, number> = {};
  const countMap: Record<string, number> = {}; // Helper for Average

  rows.forEach((row) => {
    const column = row.data[groupBy] ?? "Unknown";

    if (metric === "count") {
      map[column] = (map[column] || 0) + 1;
    } else {
      // Both 'sum' and 'avg' need the numeric value
      const value = +row.data[valueColumn] || 0;
      map[column] = (map[column] || 0) + value;

      if (metric === "avg") {
        countMap[column] = (countMap[column] || 0) + 1;
      }
    }
  });

  // Final transformation: Mapping the above map object to array of objects
  return Object.entries(map).map(([name, value]) => {
    const avgValue = Number((value / (countMap[name] || 1)).toFixed(2)); // 2 decimal and converted to Number
    return {
      columnName: name,
      numericMetric: metric === "avg" ? avgValue : value,
    };
  }); // [ { columnName: "A", count: 1 }, { numericMetric: "B", count: 2 } ]
};
