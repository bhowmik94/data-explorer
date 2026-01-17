import type { SchemaResult, NormalizedRow } from "../dtos/utils";
import type { GenericObject } from "../types/common";

// Retrieve core and extra keys from parsed data
export const extractSchema = function (
  data: GenericObject[]
): SchemaResult {
  const keyCounts = new Map<string, number>();

  // At least 50% of entries
  const thresholdNoRows = Math.ceil(data.length / 2);

  data.forEach((row) => {
    Object.keys(row).forEach((key) => {
      keyCounts.set(key, (keyCounts.get(key) ?? 0) + 1);
    });
  });

  const coreKeys: string[] = [];
  const extraKeys: string[] = [];

  keyCounts.forEach((val, key) => {
    if (val < thresholdNoRows) extraKeys.push(key);
    if (val >= thresholdNoRows) coreKeys.push(key);
  });

  return { coreSchema: coreKeys, extraSchema: extraKeys };
};

// Normalize each data row against the schema
export const normalizeData = function (
  data: GenericObject[],
  columns: string[]
): NormalizedRow[] {
  return data.map((row) => {
    const normalizedRow: GenericObject = {};
    const missingCols = new Set<string>();

    columns.forEach((col) => {
      if (row[col] == undefined) {
        normalizedRow[col] = "-";
        missingCols.add(col);
      } else {
        normalizedRow[col] = row[col];
      }
    });
    return { data: normalizedRow, missingCols };
  });
};

// Check for inconsistent rows in data
export const hasInconsistentSchema = function (
  data: GenericObject[],
  columns: string[]
): boolean {
  return data.some((row) => {
    return Object.keys(row).length !== columns.length;
  });
};

// match global filter search query with table row objects
export const tableGlobalSearch = function (
  obj: GenericObject,
  query: string
) {
  // if (!query) return true;

  const lowerQuery = query.toLocaleLowerCase();

  return Object.values(obj).some(
    (val) => val != null && val.toString().toLowerCase().includes(lowerQuery)
  );
};
