import { useState, type ChangeEvent } from "react";
import "./App.css";
import Table from "react-bootstrap/Table";
import {
  extractSchema,
  normalizeData,
  hasInconsistentSchema,
} from "./utls/dataUtils";
import type { NormalizedRow } from "./dtos/utils";
import type { tableSort } from "./dtos/dashboard";
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";

function App() {
  const [tableData, setTableData] = useState<NormalizedRow[]>([]);
  const [sortColumn, setSortColumn] = useState<tableSort["column"]>(null);
  const [sortDirection, setSortDirection] = useState<tableSort["order"]>("asc");

  // Derived columns array from the uploaded JSON table data
  const columns = tableData.length > 0 ? Object.keys(tableData[0].data) : [];

  const validateJSON = function (json: any): {
    valid: boolean;
    message: string;
  } {
    if (!Array.isArray(json)) {
      return { valid: false, message: "JSON must be an array" };
    }

    if (json.length === 0) {
      return { valid: false, message: "JSON file is empty" };
    }

    if (typeof json[0] !== "object" || json[0] == null) {
      return { valid: false, message: "JSON must contain objects" };
    }

    return { valid: true, message: "JSON file is valid" };
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedJSON = JSON.parse(reader.result as string);
        const { valid, message } = validateJSON(parsedJSON);

        const { coreSchema, extraSchema } = extractSchema(parsedJSON);
        const normalizedData = normalizeData(parsedJSON, coreSchema);
        const isInconsistent = hasInconsistentSchema(parsedJSON, coreSchema);

        if (isInconsistent) {
          alert("Some rows had missing or extra fields. Data was normalized.");
        }

        if (!valid) {
          alert(message);
          return;
        }
        setTableData(normalizedData);
      } catch (error) {}
    };

    reader.readAsText(file);
  };

  const handleSort = function (column: string) {
    let nextDirection: "asc" | "desc" = "asc";
    if (sortColumn === column) {
      nextDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortColumn(column);
    setSortDirection(nextDirection);

    const sorted = [...tableData].sort((a, b) => {
      const aMissing = a.missingCols.has(column);
      const bMissing = b.missingCols.has(column);

      if (aMissing && !bMissing) return 1;
      if (!aMissing && bMissing) return -1;
      if (aMissing && bMissing) return 0;

      const aValue = a.data[column];
      const bValue = b.data[column];

      // Determine direction multiplier: 1 for asc, -1 for desc
      const modifier = nextDirection === "asc" ? 1 : -1;

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
      <input type="file" onChange={onFileChange} />
      <Table bordered responsive>
        <thead>
          <tr>
            {tableData.length != 0 && <th>#</th>}
            {columns.map((col) => (
              <th key={col}>
                {col}{" "}
                <span>
                  <button onClick={(e) => handleSort(col)}>
                    {sortColumn === col && sortDirection == "asc" ? (
                      <FaCaretUp />
                    ) : (
                      <FaCaretDown />
                    )}
                  </button>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr
              key={idx}
              className={row.missingCols.size > 0 ? "table-warning" : ""}
            >
              <td>{idx + 1}</td>
              {columns.map((col) => (
                <td
                  key={col}
                  className={row.missingCols.has(col) ? "empty-cell" : ""}
                >
                  {String(row.data[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default App;
