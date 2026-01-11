import type { ChartData } from "../dtos/dashboard";

export const groupByRoomType = (rows: any[]): ChartData[] => {
  const map: Record<string, number> = {};

  rows.forEach((row) => {
    const type = row.data.room_type ?? "Unknown";
    map[type] = (map[type] || 0) + 1;
  }); // { "A": 1, "B": 2 }

  // Mapping map object to array of objects
  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
  })); // [ { name: "A", count: 1 }, { name: "B", count: 2 } ]
};
