export type SortOrder = "asc" | "desc";

export interface tableSort {
  column: string | null;
  order: SortOrder;
}

export type ChartData = {
  name: string;
  count: number;
};
