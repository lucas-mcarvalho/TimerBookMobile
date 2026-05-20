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
import globalStyles from "./src/styles/globalStyles";

// --- Screens & Components ---
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LibraryScreen from "./src/screens/LibraryScreen";
import NewBookScreen from "./src/screens/NewBookScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ReaderScreen from "./src/components/Reader/ReaderScreen";
import Estatisticas from "./src/components/estatisticas";

// --- API & Storage ---
import {
  clearSessionStorage,
  getStoredApiUrl,
  getStoredToken,
  saveApiUrl,
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
 
  // ── Reader state (replaces ReadingSessionPanel) ──
  const [readerSession, setReaderSession] = useState(null);
 
  // ── Boot: restore stored API URL + token ──
  useEffect(() => {
    async function restore() {
      const storedApiUrl = await getStoredApiUrl();
      const token = await getStoredToken();
      if (storedApiUrl) {
        setApiUrl(storedApiUrl);
        setRuntimeApiUrl(storedApiUrl);
      } else {
        setRuntimeApiUrl(apiUrl);
      }
      setAuthenticated(Boolean(token));
      setBooting(false);
    }
    restore();
  }, []);
 
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
      console.log("token", token);
      const webUrl = `${WEB_URL}/leitor?bookId=${book.id}&sessionId=${currentSession.id}&page=${startPage}&token=${token}`;
 
      setReaderSession({
        book,
        sessionId: currentSession.id,
        initialPage: startPage,
        webUrl,
        token
      });
    } catch (error) {
      Alert.alert("Leitura", getErrorMessage(error));
    }
  }
 
  // Called when web app posts SESSION_END
  async function handleCloseReader(finalPage) {
    if (!readerSession?.sessionId) {
      setReaderSession(null);
      return;
    }
    try {
      await finishReadingSession(
        readerSession.sessionId,
        finalPage ?? readerSession.initialPage
      );
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
        <ExpoStatusBar style="light" />
        <AuthScreen
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
        session={readerSession}
        onClose={handleCloseReader}
      />
    );
  }
 
  // ── Main App ──
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <ExpoStatusBar style="light" />
      
      <View style={globalStyles.appShell}>
        {statsReadingId ? (
          <Estatisticas 
            readingId={statsReadingId} 
            onBack={() => setStatsReadingId(null)} 
          />
        ) : (
          <>
            {activeTab === "home" && (
              <HomeScreen
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
                form={bookForm}
                setForm={setBookForm}
                onCreateBook={handleCreateBook}
                loading={savingBook}
              />
            )}
            {activeTab === "profile" && (
              <ProfileScreen
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
          return (
            <Pressable
              key={tab.key}
              onPress={() => handleTabPress(tab.key)} 
              style={[globalStyles.tab, active && globalStyles.activeTab]}
            >
              <Text style={[globalStyles.tabText, active && globalStyles.activeTabText]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
