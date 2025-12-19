import { useState } from "react";
import "./App.css";
import {
  extractSchema,
  normalizeData,
  hasInconsistentSchema,
} from "./utils/dataUtils";
import type { NormalizedRow } from "./dtos/utils";
import type { tableSort, SortOrder } from "./dtos/dashboard";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";

function App() {
  const [tableData, setTableData] = useState<NormalizedRow[]>([]);
  const [sortColumn, setSortColumn] = useState<tableSort["column"]>(null);
  const [sortDirection, setSortDirection] = useState<tableSort["order"]>("asc");
  // Derived columns array from the uploaded JSON table data
  const columns = tableData.length > 0 ? Object.keys(tableData[0].data) : [];

  const handleParsedData = function (parsedData: Record<string, unknown>[]) {
    const { coreSchema, extraSchema } = extractSchema(parsedData);
    const normalizedData = normalizeData(parsedData, coreSchema);
    const isInconsistent = hasInconsistentSchema(parsedData, coreSchema);

    if (isInconsistent) {
      alert("Some rows had missing or extra fields. Data was normalized.");
    }

    setTableData(normalizedData);
  };

  const handleSort = function (column: string, direction: SortOrder) {
    setSortColumn(column);
    setSortDirection(direction);

    const sorted = [...tableData].sort((a, b) => {
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
        result = String(aValue).localeCompare(String(bValue));
      }

      // Apply the modifier to flip the result if descending
      return result * modifier;
    });

    setTableData(sorted);
  };

  return (
    <>
      <FileUpload onDataParsed={handleParsedData} />
      <DataTable
        rows={tableData}
        columns={columns}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </>
  );
}

export default App;
