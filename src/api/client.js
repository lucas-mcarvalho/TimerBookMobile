import { Platform } from "react-native";
import {
  clearSessionStorage,
  getStoredApiUrl,
  getStoredRefreshToken,
  getStoredToken,
  saveTokens
} from "../utils/storage";

let runtimeApiUrl = null;

export function getDefaultApiUrl() {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }

  return "http://localhost:8080";
}

export async function getApiUrl() {
  if (runtimeApiUrl) {
    return runtimeApiUrl;
  }

  const storedUrl = await getStoredApiUrl();
  runtimeApiUrl = storedUrl || getDefaultApiUrl();
  return runtimeApiUrl;
}

export function setRuntimeApiUrl(url) {
  runtimeApiUrl = url;
}

function normalizeUrl(baseUrl, path) {
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessToken() {
  const refreshToken = await getStoredRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token ausente.");
  }

  const baseUrl = await getApiUrl();
  const response = await fetch(normalizeUrl(baseUrl, "/auth/refresh"), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`
    }
  });

  const data = await parseResponse(response);

  if (!response.ok || !data?.token) {
    throw new Error("Sessao expirada.");
  }

  await saveTokens({
    token: data.token,
    refreshToken: data.refreshToken || refreshToken
  });

  return data.token;
}

export async function apiFetch(path, options = {}) {
  const {
    body,
    headers = {},
    method = "GET",
    retry = true,
    skipAuth = false,
    multipart = false
  } = options;

  const baseUrl = await getApiUrl();
  const token = skipAuth ? null : await getStoredToken();
  const requestHeaders = { ...headers };

  if (!multipart) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(normalizeUrl(baseUrl, path), {
    method,
    headers: requestHeaders,
    body: multipart || typeof body === "string" ? body : JSON.stringify(body)
  });

  const data = await parseResponse(response);

  if (response.status === 401 && retry && !skipAuth) {
    try {
      await refreshAccessToken();
      return apiFetch(path, { ...options, retry: false });
    } catch (error) {
      await clearSessionStorage();
      throw error;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === "string"
        ? data
        : data?.message || "Nao foi possivel completar a requisicao.";
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function resolveMediaUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return getApiUrl().then((baseUrl) => `${baseUrl.replace(/\/+$/, "")}${cleanPath}`);
}
