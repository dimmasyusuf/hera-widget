export const getApiUrl = (): string => {
  const DEFAULT_API = "https://platform-staging-api.heracx.ai";

  const selector =
    process.env.REACT_APP_ENV === "production"
      ? 'script[src*="widget.min.js"]'
      : 'script[src*="widget.js"]';

  let script = document.currentScript as HTMLScriptElement | null;

  if (!script || !/widget(\.min)?\.js/.test(script.src)) {
    script = document.querySelector(selector) as HTMLScriptElement | null;
  }

  if (!script) {
    return DEFAULT_API;
  }

  const datasetApiUrl = script.dataset ? script.dataset.apiUrl : "";
  if (datasetApiUrl) {
    return datasetApiUrl;
  }

  const src = script.src;
  const qPos = src.indexOf("?");
  if (qPos === -1) {
    return DEFAULT_API;
  }

  const query = src.slice(qPos + 1);
  const params: Record<string, string> = {};

  query.split("&").forEach(pair => {
    const [rawKey, rawValue = ""] = pair.split("=");
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rawValue);
    if (key) {
      params[key] = value;
    }
  });

  return params["api-url"] || DEFAULT_API;
};
