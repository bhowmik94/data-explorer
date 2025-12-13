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

    return { valid: true, message: "JSON file is alright" };
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedJSON = JSON.parse(reader.result as string);
        const { valid, message } = validateJSON(parsedJSON);

        if (!valid) {
          alert(message);
          return;
        }

        setTableData(parsedJSON);
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
