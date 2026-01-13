export const METRIC_OPTIONS = [
  { label: "Total Count", value: "count" },
  { label: "Average Value", value: "avg" },
  { label: "Sum", value: "sum" },
] as const; // 'as const' makes the values read-only and specific