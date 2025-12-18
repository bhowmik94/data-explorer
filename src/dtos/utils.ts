export interface SchemaResult {
  coreSchema: string[];
  extraSchema: string[];
}

export interface NormalizedRow {
  data: Record<string, unknown>;
  missingCols: Set<string>;
}