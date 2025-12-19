export const validateJSON = function (json: any): {
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
