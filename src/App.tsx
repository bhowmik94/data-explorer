import { useEffect, useState } from "react";
import "./App.css";
import { extractSchema, normalizeData, hasInconsistentSchema, tableGlobalSearch } from "./utils/dataUtils";
import type { NormalizedRow } from "./dtos/utils";
import type { tableSort, SortOrder } from "./dtos/dashboard";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import { groupByRoomType } from "./utils/chartHelpers";
import { DataBarChart } from "./components/BarChart";

import Papa from "papaparse"; // Recommended for CSV parsing
import { Dashboard } from "./components/Dashboard";

function App() {
  const [rawNormalizedData, setRawNormalizedData] = useState<NormalizedRow[]>([]);

  // 1. Preload Logic
  useEffect(() => {
    const preloadData = async () => {
      try {
        const response = await fetch("/data/listings.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // Use your existing processing logic
            processAndSetData(results.data);
          },
        });
      } catch (error) {
        console.error("Failed to preload data", error);
      }
    };
    preloadData();
  }, []);

  // Shared processing logic for both Preload and Upload
  const processAndSetData = (parsedData: any[]) => {
    const { coreSchema } = extractSchema(parsedData);
    const normalized = normalizeData(parsedData, coreSchema);
    setRawNormalizedData(normalized);
  };

  return (
    <div className="app-container">
      <nav className="top-nav">
        <h2>Data Analyzer</h2>
        {/* Upload is now separate and just feeds the same setter */}
        <FileUpload onDataParsed={processAndSetData} />
      </nav>

      <main className="main-content">
        {rawNormalizedData.length > 0 ? (
          <Dashboard data={rawNormalizedData} />
        ) : (
          <div className="loader">Loading initial data...</div>
        )}
      </main>
    </div>
  );
}

export default App;
