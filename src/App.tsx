import { useState, type ChangeEvent } from "react";
import "./App.css";

function App() {
  const [tableData, setTableData] = useState<Record<string, unknown>[]>([]);

  // Derived columns array from the uploaded JSON table data
  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

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
  
  // Retrieve all unique keys from parsed data
  const extractSchema = function (data: Record<string, unknown>[]): string[] {
    const keys = new Set<string>();

    data.forEach((row) => {
      Object.keys(row).forEach((key) => keys.add(key));
    });

    return Array.from(keys);
  };

  // Normalize each data row against the schema
  const normalizeData = function (
    data: Record<string, unknown>[],
    columns: string[]
  ): Record<string, unknown>[] {
    return data.map((row) => {
      const normalizedRow: Record<string, unknown> = {};

      columns.forEach((col) => {
        normalizedRow[col] = row[col] ?? "";
      });

      return normalizedRow;
    });
  };

  // Check for inconsistent rows in data
  const hasInconsistentSchema = function (
    data: Record<string, unknown>[],
    columns: string[]
  ): boolean {
    return data.some((row) => {
      return Object.keys(row).length !== columns.length;
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedJSON = JSON.parse(reader.result as string);
        const { valid, message } = validateJSON(parsedJSON);

        const schema = extractSchema(parsedJSON);
        const normalizedData = normalizeData(parsedJSON, schema);
        const isInconsistent = hasInconsistentSchema(parsedJSON, schema);

        if (isInconsistent) {
            alert('Some rows had missing or extra fields. Data was normalized.');
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

  return (
    <>
      <input type="file" onChange={onFileChange} />
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col) => (
                <td key={col}>{String(row[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default App;
