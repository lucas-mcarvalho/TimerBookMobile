import React, { useState, useRef } from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from "react-native-webview";
import globalStyles from '../../styles/globalStyles';
import { getBookTitle } from '../../utils/helpers';

function ReaderScreen({ session, onClose }) {
  const webviewRef = useRef(null);
  const [webLoading, setWebLoading] = useState(true);

  const injectedJS = `
  localStorage.setItem("token", ${JSON.stringify(session.token)});
  localStorage.setItem("refreshToken", ${JSON.stringify(session.token)});
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0b1221" }}>
      <StatusBar barStyle="light-content" />
      {webLoading && (
        <View style={globalStyles.readerLoading}>
          <ActivityIndicator size="large" color="#2ecc71" />
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
