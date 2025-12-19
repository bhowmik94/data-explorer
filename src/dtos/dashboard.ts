export type SortOrder = "asc" | "desc";

export interface tableSort {
  column: string | null;
  order: SortOrder;
}
