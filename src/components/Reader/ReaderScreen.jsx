import React, { useState, useRef } from 'react';
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text } from 'react-native';
import { WebView } from "react-native-webview";
import getGlobalStyles from '../../styles/globalStyles';
import { getBookTitle } from '../../utils/helpers';

function ReaderScreen({ session, onClose, theme }) {
  const webviewRef = useRef(null);
  const [webLoading, setWebLoading] = useState(true);
  const globalStyles = getGlobalStyles(theme);

  // Runs before the web app mounts, so auth and route state exist on mobile.
  const injectedJS = `
  (function () {
    var token = ${JSON.stringify(session.token || "")};
    var refreshToken = ${JSON.stringify(session.refreshToken || session.token || "")};
    var apiUrl = ${JSON.stringify(session.apiUrl || "")};
    var iaApiUrl = ${JSON.stringify(session.iaApiUrl || "")};
    var routeState = ${JSON.stringify({
      book: session.book,
      sessionId: session.sessionId,
      initialPage: session.initialPage
    })};
    var preferencesKey = ${JSON.stringify(
      `timerbook-pdf-preferences-${session.book?.id || session.book?.dataPath || "livro"}`
    )};
    var mobilePreferences = {
      viewMode: "single",
      zoom: 0.85,
      fitWidth: true,
      visualMode: "normal",
      textMode: false,
      textSize: 18,
      lineHeight: 1.7,
      rotation: 0
    };

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("timerbook.accessToken", token);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("timerbook.refreshToken", refreshToken);
    }
    localStorage.setItem("timerbook-theme", ${JSON.stringify(session.themeMode || "dark")});
    localStorage.setItem(preferencesKey, JSON.stringify(mobilePreferences));

    window.history.replaceState(
      Object.assign({}, window.history.state || {}, { usr: routeState }),
      "",
      window.location.href
    );

    function applyMobileStyles() {
      if (!document.head) {
        setTimeout(applyMobileStyles, 30);
        return;
      }
      if (document.getElementById("timerbook-mobile-reader-style")) return;

      var style = document.createElement("style");
      style.id = "timerbook-mobile-reader-style";
      style.textContent = [
        ".leitor-topbar{height:auto!important;min-height:52px!important;padding:8px 14px!important;gap:10px!important}",
        ".leitor-book-title{max-width:140px!important;font-size:13px!important}",
        ".leitor-page-nav{display:none!important}",
        ".leitor-ai-toggle{position:fixed!important;right:14px!important;bottom:14px!important;z-index:1100!important;display:flex!important;align-items:center!important;justify-content:center!important;min-width:50px!important;min-height:46px!important;padding:0 14px!important;font-size:12px!important;gap:6px!important;border-radius:999px!important;background:rgba(15,23,42,0.96)!important;border:1px solid rgba(99,102,241,0.45)!important;box-shadow:0 8px 24px rgba(0,0,0,0.38)!important}",
        ".leitor-ai-toggle.active{background:#4f46e5!important;color:#ffffff!important;border-color:rgba(255,255,255,0.18)!important}",
        ".leitor-back-btn{padding:6px 12px!important;font-size:12px!important}",
        ".leitor-pdf-body{padding:8px!important;overflow:hidden!important}",
        ".leitor-body{position:relative!important}",
        ".leitor-drawer{position:fixed!important;top:180px!important;right:10px!important;bottom:150px!important;left:auto!important;width:min(54vw,220px)!important;max-width:none!important;height:auto!important;z-index:1000!important;opacity:0!important;transform:translateX(calc(100% + 12px))!important;transition:transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1),opacity 0.2s ease!important;border:1px solid rgba(255,255,255,0.08)!important;border-radius:14px!important;box-shadow:-10px 0 30px rgba(0,0,0,0.42)!important}",
        ".leitor-drawer.open{width:min(54vw,220px)!important;max-width:none!important;transform:translateX(0)!important;opacity:1!important}",
        ".leitor-drawer-inner{width:100%!important;height:100%!important;border-radius:14px!important;background:rgba(14, 21, 37, 0.98)!important}",
        ".leitor-drawer-header{padding:7px 10px!important}",
        ".leitor-drawer-title{font-size:12px!important}",
        ".leitor-context-info{display:none!important}",
        ".leitor-status-badge{font-size:9px!important;padding:2px 6px!important}",
        ".leitor-chat-area{padding:8px 10px!important;gap:7px!important}",
        ".leitor-empty-state{min-height:80px!important;padding:8px 0!important;gap:8px!important}",
        ".leitor-empty-icon{width:24px!important;height:24px!important}",
        ".leitor-empty-text{font-size:12px!important;line-height:1.35!important}",
        ".leitor-user-bubble,.leitor-ai-bubble{max-width:82%!important;padding:7px 9px!important;border-radius:12px!important}",
        ".leitor-user-text,.leitor-ai-text{font-size:12px!important;line-height:1.35!important}",
        ".leitor-bubble-label{font-size:8px!important;margin-bottom:3px!important}",
        ".leitor-chips{padding:0 10px 7px!important;gap:5px!important;flex-wrap:nowrap!important;overflow-x:auto!important}",
        ".leitor-chip{flex:0 0 auto!important;font-size:10px!important;padding:5px 8px!important}",
        ".leitor-input-area{padding:7px 10px 9px!important}",
        ".leitor-input-wrap{padding:6px 8px!important;gap:4px!important;border-radius:10px!important}",
        ".leitor-textarea{font-size:12px!important;line-height:1.3!important;max-height:52px!important}",
        ".leitor-hint{display:none!important}",
        ".leitor-send-btn{min-height:26px!important;padding:5px 10px!important;font-size:11px!important}",
        ".pdf-viewer{width:100%!important;gap:6px!important}",
        ".pdf-toolbar{padding:6px!important;gap:6px!important;border-radius:8px!important}",
        ".pdf-toolbar-group{min-height:30px!important;padding:2px!important;gap:2px!important}",
        ".pdf-toolbar button{min-width:30px!important;min-height:28px!important;padding:0 6px!important;font-size:11px!important}",
        ".pdf-page-jump,.pdf-zoom-label,.pdf-search-count{font-size:11px!important}",
        ".pdf-search,.pdf-toolbar-group[aria-label='Acessibilidade visual']{display:none!important}",
        ".pdf-viewport{border-radius:8px!important}",
        ".pdf-pages{gap:10px!important;padding:8px 0 24px!important}",
        ".pdf-page-shell,.pdf-page-shell canvas{border-radius:4px!important;max-width:100%!important;height:auto!important}"
      ].join("\\n");
      document.head.appendChild(style);
    }

    applyMobileStyles();

    function rewriteApiUrl(url) {
      if (typeof url !== "string") return url;

      if (apiUrl) {
        url = url
          .replace(/^https?:\\/\\/[^/]+:8080/i, apiUrl)
          .replace(/^https?:\\/\\/(?:localhost|127\\.0\\.0\\.1|10\\.0\\.2\\.2|192\\.168\\.\\d+\\.\\d+)(?=\\/auth\\/refresh)/i, apiUrl)
          .replace(/^http:\\/\\/localhost:8080/i, apiUrl)
          .replace(/^http:\\/\\/127\\.0\\.0\\.1:8080/i, apiUrl)
          .replace(/^http:\\/\\/10\\.0\\.2\\.2:8080/i, apiUrl);
      }

      if (iaApiUrl) {
        url = url
          .replace(/^https?:\\/\\/[^/]+:8000/i, iaApiUrl)
          .replace(/^http:\\/\\/localhost:8000/i, iaApiUrl)
          .replace(/^http:\\/\\/127\\.0\\.0\\.1:8000/i, iaApiUrl)
          .replace(/^http:\\/\\/10\\.0\\.2\\.2:8000/i, iaApiUrl);
      }

      return url;
    }

    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function () {
      var args = Array.prototype.slice.call(arguments);
      args[1] = rewriteApiUrl(args[1]);
      this.__timerbookUrl = args[1];
      return originalOpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function (body) {
      var isFinishRequest = /\\/reading-sessions\\/[^/]+\\/finish/.test(this.__timerbookUrl || "");
      var finishPage = null;

      if (isFinishRequest) {
        try {
          var parsedBody = typeof body === "string" ? JSON.parse(body) : null;
          finishPage = parsedBody && parsedBody.endPage;
        } catch (err) {}

        this.addEventListener("load", function () {
          if (this.status >= 200 && this.status < 300 && window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: "SESSION_END",
              page: finishPage,
              alreadyFinished: true
            }));
          }
        });
      }

      return originalSend.apply(this, arguments);
    };

    var originalFetch = window.fetch;
    if (originalFetch) {
      window.fetch = function (input, init) {
        if (typeof input === "string") {
          input = rewriteApiUrl(input);
        } else if (input && input.url) {
          input = new Request(rewriteApiUrl(input.url), input);
        }
        return originalFetch.call(this, input, init);
      };
    }
  })();
  true;
`;
  const handleMessage = (event) => {
    try {
      const { type, page, alreadyFinished } = JSON.parse(event.nativeEvent.data);
      if (type === "SESSION_END") onClose(page, alreadyFinished);
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
