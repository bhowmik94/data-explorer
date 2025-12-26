import { useEffect, useState } from "react";
import type { NormalizedRow } from "../dtos/utils";
import { tableGlobalSearch } from "../utils/dataUtils";

export const useDataTable = (initialData: NormalizedRow[]) => {
  const [baseData, setBaseData] = useState(initialData);
  const [displayData, setDisplayData] = useState(initialData);
  const [sortConfig, setSortConfig] = useState<{
    column: string | null;
    order: "asc" | "desc";
  }>({
    column: null,
    order: "asc",
  });

  // Sync internal state if initialData changes (like after a new upload)
  useEffect(() => {
    setBaseData(initialData);
    setDisplayData(initialData);
  }, [initialData]);

  const handleSort = (column: string, direction: "asc" | "desc") => {
    setSortConfig({ column, order: direction });
    const sorted = [...displayData].sort((a, b) => {
      const aMissing = a.missingCols.has(column);
      const bMissing = b.missingCols.has(column);

      if (aMissing && !bMissing) return 1;
      if (!aMissing && bMissing) return -1;
      if (aMissing && bMissing) return 0;

      const aValue = a.data[column];
      const bValue = b.data[column];

      // Determine direction multiplier: 1 for asc, -1 for desc
      const modifier = direction === "asc" ? 1 : -1;

      let result = 0;
      if (typeof aValue === "number" && typeof bValue === "number") {
        result = aValue - bValue;
      } else {
        result = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      // Apply the modifier to flip the result if descending
      return result * modifier;
    });
    setDisplayData(sorted);
  };

  const handleSearch = (query: string) => {
    const filtered = baseData.filter((item) =>
      tableGlobalSearch(item.data, query)
    );
    setDisplayData(filtered);
    setSortConfig({ column: null, order: "asc" });
  };

  return { displayData, handleSort, handleSearch, sortConfig };
};
