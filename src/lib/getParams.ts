const PLUS = /\+/g;
const STACK_TRACE_SPLIT_PATTERN = /(?:Error)?\n(?:\s*at\s+)?/;
const STACK_TRACE_ROW_PATTERN1 = /^.+?\s\((.+?):\d+:\d+\)$/;
const STACK_TRACE_ROW_PATTERN2 = /^(?:.*?@)?(.*?):\d+(?::\d+)?$/;

function makeSearchParams(qs: string) {
  const query = qs.charAt(0) === "?" ? qs.slice(1) : qs;

  if (typeof URLSearchParams !== "undefined") {
    return new URLSearchParams(query.replace(PLUS, "%2B"));
  }

  const store: Record<string, string> = {};
  query.split("&").forEach(pair => {
    if (!pair) return;
    const [k, v = ""] = pair.split("=");
    store[decodeURIComponent(k)] = decodeURIComponent(v);
  });

  return {
    get(key: string) {
      return store.hasOwnProperty(key) ? store[key] : null;
    },
    has(key: string) {
      return store.hasOwnProperty(key);
    },
    toString() {
      return query;
    }
  };
}

export const getParams = () => {
  let params = makeSearchParams(window.location.search);
  try {
    const stack = new Error().stack || "";
    const row = stack.split(STACK_TRACE_SPLIT_PATTERN, 2)[1] || "";
    const [, url] =
      row.match(STACK_TRACE_ROW_PATTERN1) ||
      row.match(STACK_TRACE_ROW_PATTERN2) ||
      [];

    if (url) {
      if (typeof URL !== "undefined") {
        const parsed = new URL(url.replace(PLUS, "%2B"));
        if (parsed.search) {
          params = makeSearchParams(parsed.search);
        }
      } else {
        const qPos = url.indexOf("?");
        if (qPos !== -1) {
          params = makeSearchParams(url.slice(qPos));
        }
      }
    }
  } catch (_) {}

  return params;
};
