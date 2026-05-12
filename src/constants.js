import { Platform } from "react-native";

const WEB_DEV_PORT = "5173";

function stripTrailingSlash(url) {
  return url.replace(/\/+$/, "");
}

function getFallbackWebUrl() {
  const host = Platform.OS === "android" ? "10.0.2.2" : "localhost";
  return `http://${host}:${WEB_DEV_PORT}`;
}

export function getDefaultWebUrl(apiUrl) {
  if (process.env.EXPO_PUBLIC_WEB_URL) {
    return stripTrailingSlash(process.env.EXPO_PUBLIC_WEB_URL);
  }

  const sourceUrl = apiUrl || process.env.EXPO_PUBLIC_API_URL;

  if (!sourceUrl) {
    return getFallbackWebUrl();
  }

  try {
    const url = new URL(sourceUrl);
    url.port = WEB_DEV_PORT;
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return stripTrailingSlash(url.toString());
  } catch {
    return getFallbackWebUrl();
  }
}

export const WEB_URL = getDefaultWebUrl();
