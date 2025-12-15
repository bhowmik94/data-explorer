import { useState, type ChangeEvent } from "react";
import "./App.css";
import Table from "react-bootstrap/Table";
import {
  extractSchema,
  normalizeData,
  hasInconsistentSchema,
  type NormalizedRow,
} from "./utls/dataUtils";

function App() {
  const [tableData, setTableData] = useState<NormalizedRow[]>([]);

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
        console.log(normalizedData);
      } catch (error) {}
    };

    reader.readAsText(file);
  };

  return (
    <>
      <input type="file" onChange={onFileChange} />
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr
              key={idx}
              className={row.missingCols.size > 0 ? "table-warning" : ""}
            >
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
