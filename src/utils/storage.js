import AsyncStorage from "@react-native-async-storage/async-storage";

export const STORAGE_KEYS = {
  accessToken: "timerbook.accessToken",
  refreshToken: "timerbook.refreshToken",
  apiUrl: "timerbook.apiUrl"
};

export async function getStoredToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.accessToken);
}

export async function getStoredRefreshToken() {
  return AsyncStorage.getItem(STORAGE_KEYS.refreshToken);
}

export async function saveTokens({ token, refreshToken }) {
  const writes = [];

  if (token) {
    writes.push([STORAGE_KEYS.accessToken, token]);
  }

  if (refreshToken) {
    writes.push([STORAGE_KEYS.refreshToken, refreshToken]);
  }

  if (writes.length > 0) {
    await AsyncStorage.multiSet(writes);
  }
}

export async function clearSessionStorage() {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.accessToken,
    STORAGE_KEYS.refreshToken
  ]);
}

export async function getStoredApiUrl() {
  return AsyncStorage.getItem(STORAGE_KEYS.apiUrl);
}

export async function saveApiUrl(url) {
  await AsyncStorage.setItem(STORAGE_KEYS.apiUrl, url);
}
