import { getAttributeElement } from "../lib/getAttributeElement";
import { getParams } from "../lib/getParams";

const params = getParams();
const attributes = getAttributeElement();
const token = params?.get("token") || attributes.token || "";
const fullDomain = window.location.origin;

const defaultHeaders = {
  token,
  ...(fullDomain ? { "x-origin": fullDomain ?? "" } : {})
};

export const widgetFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const headers = {
    ...defaultHeaders,
    ...(options.headers || {})
  };

  const fetchOptions: RequestInit = {
    ...options,
    headers
  };
  return fetch(url, fetchOptions);
};

export async function getResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }
  return response.json() as Promise<T>;
}
