import { useState } from "react";
import "./App.css";
import {
  extractSchema,
  normalizeData,
  hasInconsistentSchema,
  tableGlobalSearch,
} from "./utils/dataUtils";
import type { NormalizedRow } from "./dtos/utils";
import type { tableSort, SortOrder } from "./dtos/dashboard";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";

function App() {
  const [baseTableData, setBaseTableData] = useState<NormalizedRow[]>([]);
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
    setBaseTableData(normalizedData);
    // Going back to initial state
    setSortColumn(null);
    setSortDirection("asc");
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
        result = String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
          sensitivity: "base",
        });
      }

      // Apply the modifier to flip the result if descending
      return result * modifier;
    });

    setTableData(sorted);
  };

  const handleTableSearch = function (query: string) {
    const filteredData = baseTableData.filter((item) =>
      tableGlobalSearch(item.data, query)
    );
    
    setTableData(filteredData);

    // initializing sort values
    setSortColumn(null);
  };

  return (
    <>
      <div className="container">
        <FileUpload onDataParsed={handleParsedData} />
        <hr />
        {tableData.length > 0 && (
          <DataTable
            rows={tableData}
            columns={columns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onSearch={handleTableSearch}
          />
        )}
      </div>
    </>
  );
}

export default App;
