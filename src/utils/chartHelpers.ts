import type { ChartData } from "../dtos/dashboard";

export const groupByRoomType = (rows: any[]): ChartData[] => {
  const map: Record<string, number> = {};

  rows.forEach((row) => {
    const type = row.data.room_type ?? "Unknown";
    map[type] = (map[type] || 0) + 1;
  });

  return Object.entries(map).map(([name, count]) => ({
    name,
    count,
  }));
};
