import type { ChangeEvent } from "react";
import { validateJSON } from "../utils/validation";

type FileUploadProps = {
  onDataParsed: (data: Record<string, unknown>[]) => void;
};

export default function FileUpload({ onDataParsed }: FileUploadProps) {
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
        onDataParsed(parsedJSON)
      } catch {
        alert('There have been some problem uploading the file');
      }
    };

    reader.readAsText(file);
  };

  return <input type="file" onChange={onFileChange} />;
}
