import useWidgetOperation from "./useWidgetOperation";
import { parseJSON, safeAtob } from "../lib/helper";
import { WidgetConfig } from "../api/type";

const useConfig = (): WidgetConfig => {
  const { data } = useWidgetOperation();
  const d = (window as any).HERA_CONFIG;
  const config = d || data.widget?.app.config || {};
  return config;
};

export default useConfig;
