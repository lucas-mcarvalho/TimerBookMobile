import { getDefaultApiUrl } from "./api/client";

const WEB_DEV_PORT = "5173";

function stripTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}

export function getDefaultWebUrl(apiUrl) {
  if (process.env.EXPO_PUBLIC_WEB_URL) {
    return stripTrailingSlash(process.env.EXPO_PUBLIC_WEB_URL);
  }

  const sourceUrl = apiUrl || process.env.EXPO_PUBLIC_API_URL || getDefaultApiUrl();

  try {
    const url = new URL(sourceUrl);
    url.port = WEB_DEV_PORT;
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return stripTrailingSlash(url.toString());
  } catch {
    return "";
  }
}

export const WEB_URL = getDefaultWebUrl();
