export const classNames = (...classes: any) => {
  return classes.filter(Boolean).join(" ");
};

export function safeJSONParse<T>({
  value,
  fallback
}: {
  value: string;
  fallback?: string;
}) {
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    return (fallback || value) as string;
  }
}

export function parseJSON<T>(value?: string | null) {
  if (!value) return {} as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return {} as T;
  }
}

export function safeAtob(value?: string | null) {
  if (!value) return "";
  try {
    return atob(value);
  } catch {
    return "";
  }
}

export const getResponse = async <T>(r: Response) => {
  const { status, statusText } = r;
  const contentType = r.headers.get("content-type");
  const isJson = contentType && contentType.indexOf("application/json") !== -1;
  const response = {
    json: (isJson ? await r.json() : {}) as T,
    text: !isJson ? await r.text() : ""
  };
  return {
    status,
    statusText,
    response
  };
};

export function addParamsToUrl(
  url: string,
  params: Record<string, string>
): string {
  // Create a new URL object
  const urlObj = new URL(url);

  // Loop through the params object and append each key-value pair as a query parameter
  Object.keys(params).forEach(key =>
    urlObj.searchParams.append(key, params[key])
  );

  // Return the modified URL as a string
  return urlObj.toString();
}

export function kebabToCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

export function castResultValue(value: any): string | number {
  switch (typeof value) {
    case "string":
    case "number":
      return value;
    case "boolean":
      return value.toString();
  }
  return "";
}

export function getObjectResult(value: any): string | number {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Array) {
    if (value.length < 1) return "";
    // only get the first element [0]
    const firstChildElement = value[0];
    if (typeof firstChildElement !== "object")
      return castResultValue(firstChildElement);
    return getObjectResult(firstChildElement);
  }

  // default object literal
  const keys = Object.keys(value);
  if (keys.length < 1) return "";

  // only get the first child [0]
  const firstChildKey = keys[0];
  const firstChildValue = value[firstChildKey];

  if (typeof firstChildValue !== "object")
    return castResultValue(firstChildValue);
  return getObjectResult(firstChildValue);
}

type TableData = Record<string, number | string>;

export function transTabelResult(results: any): TableData[] {
  const transformed: TableData[] = [];
  for (const result of results) {
    const tempResult: TableData = {};
    for (const resultKey in result) {
      const resultValue = result[resultKey];
      // can be set to unknown if needed
      if (resultValue === undefined || resultValue === null) {
        tempResult[resultKey] = "NULL";
        continue;
      }
      if (typeof resultValue === "object") {
        tempResult[resultKey] = getObjectResult(resultValue);
        continue;
      }

      // if the result value type is not object, cast the value directly
      tempResult[resultKey] = castResultValue(resultValue);
    }
    transformed.push(tempResult);
  }
  return transformed;
}

export function isImageLink(link: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

  const lowerCaseLink = link.toLowerCase();

  return imageExtensions.some(ext => lowerCaseLink.endsWith(`.${ext}`));
}

// Utility function to extract file name and size
export const getFileMetadata = (file: File): { name: string; size: string } => {
  const fileName = file.name;
  const fileSize = (file.size / 1024).toFixed(2) + " KB"; // Convert size to MB and format
  return { name: fileName, size: fileSize };
};
