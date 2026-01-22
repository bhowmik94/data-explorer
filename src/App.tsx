import { useEffect, useState } from "react";
import "./App.css";
import { extractSchema, normalizeData } from "./utils/dataUtils";
import type { NormalizedRow } from "./dtos/utils";
import FileUpload from "./components/FileUpload";

import Papa from "papaparse";
import { Dashboard } from "./components/Dashboard";
import { Header } from "./layout/header";
import type { GenericObject } from "./types/common";
import { Analytics } from "@vercel/analytics/next"

function App() {
  const [rawNormalizedData, setRawNormalizedData] = useState<NormalizedRow[]>([]);
  const [dataId, setDataId] = useState<number>(0); // A counter to change key of Dashboard component

  // Shared processing logic for both Preload and Upload
  const processAndSetData = (parsedData: GenericObject[]) => {
    console.log(parsedData)
    const { coreSchema } = extractSchema(parsedData);
    const normalized = normalizeData(parsedData, coreSchema);
    setRawNormalizedData(normalized);
    setDataId(prev => prev + 1);
  };

  // 1. Preload Logic
  useEffect(() => {
    const preloadData = async () => {
      try {
        const response = await fetch("/data/Titanic-Dataset.csv");
        const csvText = await response.text();

        Papa.parse<GenericObject>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            processAndSetData(results.data);
          },
        });
      } catch (error) {
        console.error("Failed to preload data", error);
      }
    };
    preloadData();
  }, []);

  return (
    <>
      <Header />
      <Analytics />
      <div className="app-container">
        <FileUpload onDataParsed={processAndSetData} />
        <main className="main-content">
          {rawNormalizedData.length > 0 ? (
            <Dashboard key={dataId} data={rawNormalizedData} />
          ) : (
            <div className="loader">Loading initial data...</div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
