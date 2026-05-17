import { useRef, useState } from "react";
import { SafeAreaView, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import { finishReadingSession } from "../api/timerbook";
import { getStoredToken } from "../utils/storage";
import { WEB_URL } from "../constants"; // "http://192.168.10.102:5173"

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

  // Inject the auth token into the web app's localStorage on load
  const injectAuth = async () => {
    const token = await getStoredToken();
    if (token && webviewRef.current) {
      webviewRef.current.injectJavaScript(`
        localStorage.setItem("timerbook.accessToken", "${token}");
        true;
      `);
    }
  };

  const uri = `${WEB_URL}/leitor?bookId=${book.id}&sessionId=${sessionId}&page=${initialPage}`;

  return (
    <SafeAreaView style={styles.root}>
      {loading && (
        <ActivityIndicator size="large" style={styles.spinner} />
      )}
      <WebView
        ref={webviewRef}
        source={{ uri }}
        onLoadEnd={() => {
          setLoading(false);
          injectAuth();
        }}
        onMessage={handleMessage}
        style={styles.webview}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  webview: { flex: 1 },
  spinner: { position: "absolute", top: "50%", left: "50%", zIndex: 10 },
});