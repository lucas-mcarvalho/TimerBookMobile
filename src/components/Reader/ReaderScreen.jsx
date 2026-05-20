import React, { useState, useRef } from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from "react-native-webview";
import getGlobalStyles from '../../styles/globalStyles';
import { getBookTitle } from '../../utils/helpers';

function ReaderScreen({ session, onClose, theme }) {
  const webviewRef = useRef(null);
  const [webLoading, setWebLoading] = useState(true);
  const globalStyles = getGlobalStyles(theme);

  // This runs BEFORE the page JS executes — so the token is
  // already in localStorage when the web app checks auth on mount
  const injectedJS = `
  localStorage.setItem("token", ${JSON.stringify(session.token)});
  localStorage.setItem("refreshToken", ${JSON.stringify(session.token)});
  localStorage.setItem("timerbook-theme", ${JSON.stringify(session.themeMode)});
  true;
`;
  const handleMessage = (event) => {
    try {
      const { type, page } = JSON.parse(event.nativeEvent.data);
      if (type === "SESSION_END") onClose(page);
    } catch (err) {
      console.error("WebView message error:", err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar barStyle={session.themeMode === "light" ? "dark-content" : "light-content"} />
      {webLoading && (
        <View style={globalStyles.readerLoading}>
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={globalStyles.readerLoadingText}>
            Carregando {getBookTitle(session.book)}…
          </Text>
        </View>
      )}
      <WebView
        ref={webviewRef}
        source={{ uri: session.webUrl }}
        injectedJavaScriptBeforeContentLoaded={injectedJS}
        onLoadEnd={() => setWebLoading(false)}
        onMessage={handleMessage}
        style={{ flex: 1 }}
        javaScriptEnabled
        domStorageEnabled
      />
    </SafeAreaView>
  );
}

export default ReaderScreen;
