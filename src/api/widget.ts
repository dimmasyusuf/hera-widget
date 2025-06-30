import { getApiUrl } from "../lib/getApiUrl";
import { getAttributeElement } from "../lib/getAttributeElement";
import { getParams } from "../lib/getParams";
import { getResponse } from "../lib/helper";
import { widgetFetch } from "./fetch";
import {
  DetailQueryResponse,
  InitWidgetResponseData,
  MutationResponse,
  Widget,
  WidgetInput
} from "./type";

const params = getParams();
const attributes = getAttributeElement();
const token = params?.get("token") || attributes.token || "";
const defaultAPIUrl = getApiUrl();
const customAPIUrl = params?.get("api-url") || attributes.apiUrl || "";
const url = (customAPIUrl || defaultAPIUrl) + "/widget";

export const initWidget = async (data: WidgetInput) => {
  const r = await widgetFetch(url, {
    method: "POST",
    headers: {
      token,
      "content-type": "application/json"
    },
    body: JSON.stringify(data),
    cache: "no-store"
  });
  return getResponse<MutationResponse<InitWidgetResponseData>>(r);
};

export const getWidget = async () => {
  const r = await widgetFetch(url, {
    headers: { token },
    cache: "no-store"
  });
  return getResponse<DetailQueryResponse<Widget>>(r);
};
