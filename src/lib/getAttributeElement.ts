import { kebabToCamelCase } from "./helper";

interface Result {
  token: string;
  fullscreen: boolean;
  hideHeader: boolean;
  hideEmailForm: boolean;
  apiUrl: string;
  user: {
    identity: string;
    data: Record<string, string>;
  };
}

export const getAttributeElement = (): Result => {
  const selector =
    process.env.REACT_APP_ENV === "production"
      ? 'script[src*="widget.min.js"]'
      : 'script[src*="widget.js"]';

  let script = document.currentScript as HTMLScriptElement | null;
  if (!script)
    script = document.querySelector(selector) as HTMLScriptElement | null;

  if (!script) {
    return {
      token: "",
      fullscreen: false,
      hideHeader: false,
      hideEmailForm: false,
      apiUrl: "https://platform-staging-api.heracx.ai",
      user: { identity: "", data: {} },
    };
  }

  const ds = script.dataset as Record<string, string | undefined>;

  const profileData: Record<string, string> = {};
  Object.keys(ds).forEach((key) => {
    if (key.startsWith("profile")) {
      const trimmed = key.slice("profile".length);
      const finalKey = kebabToCamelCase(trimmed);
      profileData[finalKey] = ds[key] as string;
    }
  });

  // INDOMOBIL - U2FsdGVkX18nUhS17FAcEn59whwNBPPybPib29otAye0IpEjORYZqNgfnczOL51V4zUU1m8XBgU9lTIxmz-_OP_bKfmqpDGThSSPggSf-Dh1OyI4_QcVDMcHDqGnMKzV2q1eFunaKLbtLqpHwbBMtw
  // HOKBEN - U2FsdGVkX1-FFCtRxH42F_ptifYNida-wWmF6cOD7JL4KTuyqEdKJb2j4JQIdIgdh7BE7hwbqeqkS_wwm1BNkinopSXBfl1OxLmpCEg-txzdqwI3ldWrgpAI3e-HNPrsHapbBqQhqwwnCEUPlXdZpQ

  return {
    token:
      ds.token ||
      "U2FsdGVkX1-FFCtRxH42F_ptifYNida-wWmF6cOD7JL4KTuyqEdKJb2j4JQIdIgdh7BE7hwbqeqkS_wwm1BNkinopSXBfl1OxLmpCEg-txzdqwI3ldWrgpAI3e-HNPrsHapbBqQhqwwnCEUPlXdZpQ",
    fullscreen: ds.fullscreen === "true",
    hideHeader: ds.hideHeader === "true",
    hideEmailForm: ds.hideEmailForm === "true",
    apiUrl: ds.apiUrl || "https://platform-api.heracx.ai",
    user: {
      identity: ds.identity || "",
      data: profileData,
    },
  };
};
