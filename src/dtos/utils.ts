import type { GenericObject } from "../types/common";

export interface SchemaResult {
  coreSchema: string[];
  extraSchema: string[];
}

export interface NormalizedRow {
  data: GenericObject;
  missingCols: Set<string>;
}