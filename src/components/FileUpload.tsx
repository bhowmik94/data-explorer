import type { ChangeEvent } from "react";
import { validateJSON } from "../utils/validation";
import Papa from "papaparse";

type FileUploadProps = {
  onDataParsed: (data: Record<string, unknown>[]) => void;
};

export default function FileUpload({ onDataParsed }: FileUploadProps) {
  const reader = new FileReader();

  const handleJSON = function (file: File) {
    reader.onload = () => {
      try {
        const parsedJSON = JSON.parse(reader.result as string);
        const { valid, message } = validateJSON(parsedJSON);
        console.log(parsedJSON);
        if (!valid) {
          alert(message);
          return;
        }
        onDataParsed(parsedJSON);
      } catch {
        alert("There have been some problem uploading the file");
      }
    };

    reader.readAsText(file);
  };

  const handleCSV = function (file: File) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as Record<string, unknown>[];
        onDataParsed(parsedData);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
        alert("There was a problem uploading the CSV file");
      },
    });
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    if (fileType === "application/json" || fileName.endsWith(".json"))
      handleJSON(file);
    else if (fileType === "text/csv" || fileName.endsWith(".csv"))
      handleCSV(file);
    else {
      alert("Unsupported file type! Please upload a JSON or CSV file.");
      // Clear the input
      e.target.value = "";
    }
  };

  return <input type="file" onChange={onFileChange} />;
}
