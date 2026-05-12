import { useEffect, useRef, useState } from "react";
import { SafeAreaView, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import { finishReadingSession } from "../api/timerbook";
import { getStoredApiUrl, getStoredToken } from "../utils/storage";
import { getDefaultWebUrl } from "../constants";

export default function LeitorScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { book, sessionId, initialPage = 1 } = route.params;

  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const handleEndSession = async (finalPage) => {
    try {
      await finishReadingSession(sessionId, finalPage);
    } catch (err) {
      console.error("Erro ao encerrar sessão:", err.message);
    } finally {
      navigation.goBack();
    }
  };

  // Messages sent from the web app via window.ReactNativeWebView.postMessage()
  const handleMessage = (event) => {
    try {
      const { type, page } = JSON.parse(event.nativeEvent.data);
      if (type === "SESSION_END") {
        handleEndSession(page);
      }
    } catch (err) {
      console.error("WebView message error:", err);
    }
  };

  // Keep auth ready before the web app checks ProtectedRoute.
  const [token, setToken] = useState(null);
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [webBaseUrl, setWebBaseUrl] = useState(getDefaultWebUrl());

  useEffect(() => {
    Promise.all([getStoredToken(), getStoredApiUrl()])
      .then(([storedToken, storedApiUrl]) => {
        setToken(storedToken);
        setWebBaseUrl(getDefaultWebUrl(storedApiUrl));
      })
      .catch(() => setToken(null))
      .finally(() => setTokenLoaded(true));
  }, []);

  const query = [
    ["bookId", book.id],
    ["sessionId", sessionId],
    ["page", initialPage],
    ["token", token]
  ]
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join("&");
  const uri = `${webBaseUrl}/leitor?${query}`;
  const injectedAuth = token ? `
    localStorage.setItem("token", ${JSON.stringify(token)});
    localStorage.setItem("refreshToken", ${JSON.stringify(token)});
    true;
  ` : "true;";

  return (
    <SafeAreaView style={styles.root}>
      {loading && (
        <ActivityIndicator size="large" style={styles.spinner} />
      )}
      {tokenLoaded && (
        <WebView
          ref={webviewRef}
          source={{ uri }}
          injectedJavaScriptBeforeContentLoaded={injectedAuth}
          onLoadEnd={() => setLoading(false)}
          onMessage={handleMessage}
          style={styles.webview}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1 },
  spinner: { position: "absolute", top: "50%", left: "50%", zIndex: 10 },
});
