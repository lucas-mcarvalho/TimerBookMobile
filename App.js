import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  Text,
  UIManager,
  View
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

// --- Styles ---
import getGlobalStyles from "./src/styles/globalStyles";
import { lightTheme, darkTheme } from "./src/styles/colors";

// --- Screens & Components ---
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LibraryScreen from "./src/screens/LibraryScreen";
import NewBookScreen from "./src/screens/NewBookScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ReaderScreen from "./src/components/Reader/ReaderScreen";
import Estatisticas from "./src/components/estatisticas";

// --- Icons ---
import HomeIcon from "./src/assets/HomeIcon.svg";
import BookIcon from "./src/assets/BookIcon.svg";
import AddIcon from "./src/assets/AddIncon.svg";
import ProfileIcon from "./src/assets/ProfileIcon.svg";

// --- API & Storage ---
import {
  clearSessionStorage,
  getStoredApiUrl,
  getStoredRefreshToken,
  getStoredTheme,
  getStoredToken,
  saveApiUrl,
  saveTheme,
  saveTokens
} from "./src/utils/storage";
import {
  createBook,
  deleteBook,
  finishReadingSession,
  getBooksByUserId,
  getBooksInProgress,
  getGeneralStats,
  getMe,
  getSessionsByReadingId,
  startReading,
  startReadingSession,
  updateReadingGoal
} from "./src/api/timerbook";
import { getDefaultApiUrl, setRuntimeApiUrl } from "./src/api/client";

// --- Utils & Constants ---
import { toNumber } from "./src/utils/formatters";
import { WEB_URL, initialBookForm, tabs } from "./src/utils/constants";
import {
  getBookTitle,
  getErrorMessage,
  getReadingBookId,
  sortSessionsByStartDesc
} from "./src/utils/helpers";

// --- Setup ---
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function getReaderWebUrl(apiUrl) {
  const envUrl = process.env.EXPO_PUBLIC_WEB_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const match = String(apiUrl || "").trim().match(/^(https?:\/\/[^/:]+)(?::\d+)?/i);
  if (!match) return WEB_URL;

  return `${match[1]}:${process.env.EXPO_PUBLIC_WEB_PORT || "5173"}`;
}

function getIaApiUrl(apiUrl) {
  const envUrl = process.env.EXPO_PUBLIC_IA_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const match = String(apiUrl || "").trim().match(/^(https?:\/\/[^/:]+)/i);
  if (!match) return "";

  return `${match[1]}:${process.env.EXPO_PUBLIC_IA_PORT || "8000"}`;
}
 
export default function App() {
  const [booting, setBooting] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [apiUrl, setApiUrl] = useState(getDefaultApiUrl());
  const [activeTab, setActiveTab] = useState("home");
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [inProgress, setInProgress] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [bookForm, setBookForm] = useState(initialBookForm);
  const [savingBook, setSavingBook] = useState(false);
  const [statsReadingId, setStatsReadingId] = useState(null);
 
  // ── Theme state ──
  const [themeMode, setThemeMode] = useState("dark");
  const currentTheme = themeMode === "light" ? lightTheme : darkTheme;
  const globalStyles = getGlobalStyles(currentTheme);

  // ── Reader state (replaces ReadingSessionPanel) ──
  const [readerSession, setReaderSession] = useState(null);
 
  // ── Boot: restore stored API URL + token + theme ──
  useEffect(() => {
    async function restore() {
      const [storedApiUrl, token, storedTheme] = await Promise.all([
        getStoredApiUrl(),
        getStoredToken(),
        getStoredTheme()
      ]);

      if (storedApiUrl) {
        setApiUrl(storedApiUrl);
        setRuntimeApiUrl(storedApiUrl);
      } else {
        setRuntimeApiUrl(apiUrl);
      }
      
      if (storedTheme) {
        setThemeMode(storedTheme);
      }

      setAuthenticated(Boolean(token));
      setBooting(false);
    }
    restore();
  }, []);
 
  async function toggleTheme() {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    await saveTheme(newMode);
  }
 
  useEffect(() => {
    if (authenticated) loadAppData();
  }, [authenticated]);
 
  async function loadAppData() {
    setRefreshing(true);
    try {
      const me = await getMe();
      setUser(me);
      const [booksData, statsData, progressData] = await Promise.all([
        getBooksByUserId(me.id),
        getGeneralStats(),
        getBooksInProgress()
      ]);
      setBooks(Array.isArray(booksData) ? booksData : []);
      setStats(statsData || null);
      setInProgress(Array.isArray(progressData) ? progressData : []);
    } catch (error) {
      Alert.alert("TimerBook", getErrorMessage(error));
      if (error.status === 401) await logout();
    } finally {
      setRefreshing(false);
    }
  }
 
  async function handleAuthenticated() {
    setAuthenticated(true);
  }
 
  async function persistApiUrl() {
    const cleanUrl = apiUrl.trim();
    if (!cleanUrl) {
      Alert.alert("API", "Informe a URL do backend.");
      return;
    }
    await saveApiUrl(cleanUrl);
    setRuntimeApiUrl(cleanUrl);
    Alert.alert("API", "Endereco salvo.");
  }
 
  async function handleCreateBook() {
    if (!bookForm.name.trim()) {
      Alert.alert("Novo livro", "Informe o nome do livro.");
      return;
    }
    setSavingBook(true);
    try {
      await createBook(user.id, {
        ...bookForm,
        name: bookForm.name.trim(),
        description: bookForm.description.trim() || "Sem descricao"
      });
      setBookForm(initialBookForm);
      setActiveTab("library");
      await loadAppData();
      Alert.alert("Novo livro", "Livro cadastrado com sucesso.");
    } catch (error) {
      Alert.alert("Novo livro", getErrorMessage(error));
    } finally {
      setSavingBook(false);
    }
  }
 
  async function handleDeleteBook(book) {
    Alert.alert("Excluir livro", `Excluir "${getBookTitle(book)}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBook(book.id);
            await loadAppData();
          } catch (error) {
            Alert.alert("Excluir livro", getErrorMessage(error));
          }
        }
      }
    ]);
  }
 
  // Opens the WebView reader
  async function handleStartBook(book, activeReading) {
    try {
      
      const startPage = toNumber(activeReading?.currentPage, 0);
      const reading = await startReading(user.id, book.id, startPage);
      const sessions = await getSessionsByReadingId(reading.id);
      let currentSession = sortSessionsByStartDesc(sessions).find((item) => !item.endedAt);
 
      if (!currentSession) {
        currentSession = await startReadingSession(reading.id, startPage);
      }
 
      const token = await getStoredToken();
      const refreshToken = await getStoredRefreshToken();
      const readerBaseUrl = getReaderWebUrl(apiUrl);
      const iaApiUrl = getIaApiUrl(apiUrl);
      const webUrl = `${readerBaseUrl}/leitor?bookId=${encodeURIComponent(book.id)}&sessionId=${encodeURIComponent(currentSession.id)}&page=${encodeURIComponent(startPage)}&token=${encodeURIComponent(token || "")}`;
 
      setReaderSession({
        book: {
          ...book,
          title: book.title || book.name
        },
        sessionId: currentSession.id,
        initialPage: startPage,
        webUrl,
        token,
        refreshToken,
        apiUrl: apiUrl.replace(/\/+$/, ""),
        iaApiUrl
      });
    } catch (error) {
      Alert.alert("Leitura", getErrorMessage(error));
    }
  }
 
  // Called when web app posts SESSION_END
  async function handleCloseReader(finalPage, alreadyFinished = false) {
    if (!readerSession?.sessionId) {
      setReaderSession(null);
      return;
    }
    try {
      if (!alreadyFinished) {
        await finishReadingSession(
          readerSession.sessionId,
          finalPage ?? readerSession.initialPage
        );
      }
    } catch (err) {
      console.error("Erro ao encerrar sessão:", err.message);
    } finally {
      setReaderSession(null);
      await loadAppData();
    }
  }
 
  async function handleSaveGoal(goal) {
    const numericGoal = Number(goal);
    if (!Number.isFinite(numericGoal) || numericGoal < 0) {
      Alert.alert("Meta", "Informe uma meta valida em minutos.");
      return;
    }
    try {
      const response = await updateReadingGoal(numericGoal);
      setUser((current) => ({
        ...current,
        dailyReadingGoalMinutes:
          response?.dailyReadingGoalMinutes ?? response?.goal ?? numericGoal
      }));
      Alert.alert("Meta", "Meta atualizada.");
    } catch (error) {
      Alert.alert("Meta", getErrorMessage(error));
    }
  }
 
  async function logout() {
    await clearSessionStorage();
    setAuthenticated(false);
    setUser(null);
    setBooks([]);
    setStats(null);
    setInProgress([]);
    setReaderSession(null);
  }

  // Nova função de mudança de aba animada
  function handleTabPress(key) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(key);
  }

  if (booting) {
    return (
      <SafeAreaView style={globalStyles.loadingScreen}>
        <ActivityIndicator color="#2ecc71" />
        <Text style={globalStyles.loadingText}>Carregando TimerBook...</Text>
      </SafeAreaView>
    );
  }
 
  // ── Auth ──
  if (!authenticated) {
    return (
      <SafeAreaView style={globalStyles.safeArea}>
        <ExpoStatusBar style={themeMode === "light" ? "dark" : "light"} />
        <AuthScreen
          theme={currentTheme}
          apiUrl={apiUrl}
          setApiUrl={setApiUrl}
          onAuthenticated={handleAuthenticated}
        />
      </SafeAreaView>
    );
  }
 
  // ── Reader (fullscreen WebView overlay) ──
  if (readerSession) {
    return (
      <ReaderScreen
        theme={currentTheme}
        session={{ ...readerSession, themeMode }}
        onClose={handleCloseReader}
      />
    );
  }
 
  // ── Main App ──
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ExpoStatusBar style={themeMode === "light" ? "dark" : "light"} />
      
      <View style={globalStyles.appShell}>
        {statsReadingId ? (
          <Estatisticas 
            isDarkMode={themeMode === "dark"}
            readingId={statsReadingId} 
            onBack={() => setStatsReadingId(null)} 
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen
                theme={currentTheme}
                apiUrl={apiUrl}
                user={user}
                stats={stats}
                inProgress={inProgress}
                onRefresh={loadAppData}
                refreshing={refreshing}
              />
            )}
            {activeTab === "library" && (
              <LibraryScreen
                theme={currentTheme}
                apiUrl={apiUrl}
                books={books}
                inProgress={inProgress}
                onStartBook={handleStartBook}
                onDeleteBook={handleDeleteBook}
                onRefresh={loadAppData}
                refreshing={refreshing}
                onViewStats={(id) => setStatsReadingId(id)}
              />
            )}
            {activeTab === "newBook" && (
              <NewBookScreen
                theme={currentTheme}
                form={bookForm}
                setForm={setBookForm}
                onCreateBook={handleCreateBook}
                loading={savingBook}
              />
            )}
            {activeTab === "profile" && (
              <ProfileScreen
                theme={currentTheme}
                themeMode={themeMode}
                onToggleTheme={toggleTheme}
                onRefreshUser={loadAppData}
                apiUrl={apiUrl}
                setApiUrl={setApiUrl}
                user={user}
                onSaveApiUrl={persistApiUrl}
                onSaveGoal={handleSaveGoal}
                onLogout={logout}
              />
            )}
          </>
        )}
      </View>
 
      <View style={globalStyles.tabBar}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;

          let Icon;
          switch (tab.key) {
            case "home": Icon = HomeIcon; break;
            case "library": Icon = BookIcon; break;
            case "newBook": Icon = AddIcon; break;
            case "profile": Icon = ProfileIcon; break;
            default: Icon = HomeIcon;
          }

          return (
            <Pressable
              key={tab.key}
              onPress={() => handleTabPress(tab.key)} 
              style={[globalStyles.tab, active && globalStyles.activeTab]}
            >
              <Icon 
                width={24} 
                height={24} 
                color={active ? "#ffffff" : currentTheme.subtext} 
              />
            </Pressable>
          );
        })}
      </View>

    </SafeAreaView>
  );
}
