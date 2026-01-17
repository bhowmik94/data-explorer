export type SortOrder = "asc" | "desc";

export interface tableSort {
  column: string | null;
  order: SortOrder;
}

export type GenericObject = Record<string, unknown>;