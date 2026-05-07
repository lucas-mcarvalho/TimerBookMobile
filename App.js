import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
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
  loginUser,
  registerUser,
  startReading,
  startReadingSession,
  updateReadingGoal
} from "./src/api/timerbook";
import { getDefaultApiUrl, setRuntimeApiUrl } from "./src/api/client";
import { formatDuration, formatTimer, toNumber } from "./src/utils/formatters";

const tabs = [
  { key: "home", label: "Inicio" },
  { key: "library", label: "Livros" },
  { key: "newBook", label: "Novo" },
  { key: "profile", label: "Perfil" }
];

const initialBookForm = {
  name: "",
  description: "",
  cover: null,
  pdf: null
};

function getErrorMessage(error) {
  return error?.message || "Algo saiu do esperado. Tente novamente.";
}

function getBookTitle(book) {
  return book?.name || book?.title || "Livro sem titulo";
}

function getBookCover(book, apiUrl) {
  const cover = book?.coverUrl || book?.coverPath;

  if (!cover) {
    return null;
  }

  if (/^https?:\/\//i.test(cover)) {
    return cover;
  }

  return `${apiUrl.replace(/\/+$/, "")}${cover.startsWith("/") ? cover : `/${cover}`}`;
}

function sortSessionsByStartDesc(sessions) {
  return [...(Array.isArray(sessions) ? sessions : [])].sort(
    (a, b) => new Date(b.startedAt || 0) - new Date(a.startedAt || 0)
  );
}

function getReadingBookId(reading) {
  return reading?.book?.id ?? reading?.bookId ?? reading?.book_id;
}

function Field({ label, value, onChangeText, secureTextEntry, keyboardType, placeholder, multiline }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#9b9184"
        multiline={multiline}
        style={[styles.input, multiline && styles.textArea]}
      />
    </View>
  );
}

function PrimaryButton({ children, onPress, disabled, variant = "primary" }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        variant === "danger" && styles.dangerButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.secondaryButtonText
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

function StatCard({ label, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function EmptyState({ title, description }) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
}

function AuthScreen({ apiUrl, setApiUrl, onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("20");
  const [loading, setLoading] = useState(false);

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

  async function submit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Campos obrigatorios", "Informe email e senha.");
      return;
    }

    if (mode === "register" && !username.trim()) {
      Alert.alert("Campos obrigatorios", "Informe seu nome de usuario.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await registerUser({
          username: username.trim(),
          email: email.trim(),
          password,
          dailyReadingGoalMinutes: goal ? Number(goal) : undefined
        });
        Alert.alert("Cadastro criado", "Agora faca login com sua conta.");
        setMode("login");
        return;
      }

      const response = await loginUser(email.trim(), password);
      await saveTokens({
        token: response.token,
        refreshToken: response.refreshToken
      });
      onAuthenticated();
    } catch (error) {
      Alert.alert("TimerBook", getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.authContainer}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.authContent}>
        <View style={styles.brandMark}>
          <Text style={styles.brandInitial}>T</Text>
        </View>
        <Text style={styles.authTitle}>TimerBook</Text>
        <Text style={styles.authSubtitle}>
          Controle suas leituras, sessoes e metas direto do celular.
        </Text>

        <View style={styles.segmented}>
          <Pressable
            onPress={() => setMode("login")}
            style={[styles.segment, mode === "login" && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, mode === "login" && styles.segmentTextActive]}>
              Entrar
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode("register")}
            style={[styles.segment, mode === "register" && styles.segmentActive]}
          >
            <Text style={[styles.segmentText, mode === "register" && styles.segmentTextActive]}>
              Cadastrar
            </Text>
          </Pressable>
        </View>

        {mode === "register" && (
          <Field label="Usuario" value={username} onChangeText={setUsername} />
        )}
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="voce@email.com"
        />
        <Field
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {mode === "register" && (
          <Field
            label="Meta diaria em minutos"
            value={goal}
            onChangeText={setGoal}
            keyboardType="numeric"
          />
        )}

        <PrimaryButton onPress={submit} disabled={loading}>
          {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta"}
        </PrimaryButton>

        <View style={styles.apiBox}>
          <Text style={styles.apiTitle}>Backend</Text>
          <TextInput
            value={apiUrl}
            onChangeText={setApiUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="http://10.0.2.2:8080"
            placeholderTextColor="#9b9184"
            style={styles.input}
          />
          <PrimaryButton onPress={persistApiUrl} variant="secondary">
            Salvar endereco da API
          </PrimaryButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function HomeScreen({ user, stats, inProgress, onRefresh, refreshing }) {
  return (
    <ScrollView
      contentContainerStyle={styles.screenContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.eyebrow}>Bem-vindo de volta</Text>
      <Text style={styles.title}>{user?.username || "Leitor"}</Text>

      <View style={styles.statsGrid}>
        <StatCard label="Paginas lidas" value={stats?.pagesRead ?? 0} />
        <StatCard label="Tempo total" value={formatDuration(stats?.totalSeconds)} />
        <StatCard label="Sessoes" value={stats?.sessionsCount ?? 0} />
        <StatCard label="Sequencia" value={`${stats?.currentStreakDays ?? 0} dias`} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Leituras em andamento</Text>
      </View>

      {inProgress.length === 0 ? (
        <EmptyState
          title="Nada em andamento"
          description="Comece uma leitura pela biblioteca para acompanhar seu progresso."
        />
      ) : (
        inProgress.map((reading) => (
          <View key={String(reading.id)} style={styles.readingRow}>
            <Text style={styles.readingTitle}>{getBookTitle(reading.book)}</Text>
            <Text style={styles.readingMeta}>Pagina atual: {reading.currentPage ?? 0}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function LibraryScreen({ apiUrl, books, inProgress, onStartBook, onDeleteBook, onRefresh, refreshing }) {
  const inProgressByBookId = useMemo(() => {
    const map = new Map();
    inProgress.forEach((reading) => {
      const bookId = getReadingBookId(reading);
      if (bookId) {
        map.set(Number(bookId), reading);
      }
    });
    return map;
  }, [inProgress]);

  return (
    <FlatList
      data={books}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.screenContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListHeaderComponent={
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.eyebrow}>Biblioteca</Text>
            <Text style={styles.title}>Meus livros</Text>
          </View>
        </View>
      }
      ListEmptyComponent={
        <EmptyState
          title="Sua biblioteca esta vazia"
          description="Cadastre seu primeiro livro na aba Novo."
        />
      }
      renderItem={({ item }) => {
        const coverUrl = getBookCover(item, apiUrl);
        const reading = inProgressByBookId.get(Number(item.id));

        return (
          <View style={styles.bookCard}>
            {coverUrl ? (
              <Image source={{ uri: coverUrl }} style={styles.cover} />
            ) : (
              <View style={styles.coverFallback}>
                <Text style={styles.coverFallbackText}>{getBookTitle(item).slice(0, 1)}</Text>
              </View>
            )}
            <View style={styles.bookInfo}>
              <Text style={styles.bookTitle}>{getBookTitle(item)}</Text>
              <Text numberOfLines={2} style={styles.bookDescription}>
                {item.description || "Sem descricao cadastrada."}
              </Text>
              {reading && (
                <Text style={styles.progressBadge}>
                  Em andamento na pagina {reading.currentPage ?? 0}
                </Text>
              )}
              <View style={styles.inlineActions}>
                <Pressable onPress={() => onStartBook(item, reading)} style={styles.smallAction}>
                  <Text style={styles.smallActionText}>Ler</Text>
                </Pressable>
                <Pressable onPress={() => onDeleteBook(item)} style={styles.smallDangerAction}>
                  <Text style={styles.smallDangerText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
}

function NewBookScreen({ form, setForm, onCreateBook, loading }) {
  async function pickCover() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8
    });

    if (!result.canceled && result.assets?.[0]) {
      setForm((current) => ({ ...current, cover: result.assets[0] }));
    }
  }

  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true
    });

    if (!result.canceled) {
      const asset = result.assets?.[0] || result;
      setForm((current) => ({ ...current, pdf: asset }));
    }
  }

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.screenContent}>
      <Text style={styles.eyebrow}>Cadastro</Text>
      <Text style={styles.title}>Novo livro</Text>
      <Field
        label="Nome"
        value={form.name}
        onChangeText={(value) => setForm((current) => ({ ...current, name: value }))}
      />
      <Field
        label="Descricao"
        value={form.description}
        onChangeText={(value) => setForm((current) => ({ ...current, description: value }))}
        multiline
      />
      <View style={styles.fileRow}>
        <Pressable onPress={pickCover} style={styles.fileButton}>
          <Text style={styles.fileButtonText}>
            {form.cover ? "Capa selecionada" : "Selecionar capa"}
          </Text>
        </Pressable>
        <Pressable onPress={pickPdf} style={styles.fileButton}>
          <Text style={styles.fileButtonText}>
            {form.pdf ? "PDF selecionado" : "Selecionar PDF"}
          </Text>
        </Pressable>
      </View>
      <PrimaryButton onPress={onCreateBook} disabled={loading}>
        {loading ? "Salvando..." : "Salvar livro"}
      </PrimaryButton>
    </ScrollView>
  );
}

function ProfileScreen({ apiUrl, setApiUrl, user, onSaveApiUrl, onSaveGoal, onLogout }) {
  const [goal, setGoal] = useState(String(user?.dailyReadingGoalMinutes ?? 20));

  useEffect(() => {
    setGoal(String(user?.dailyReadingGoalMinutes ?? 20));
  }, [user?.dailyReadingGoalMinutes]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.screenContent}>
      <Text style={styles.eyebrow}>Conta</Text>
      <Text style={styles.title}>{user?.username || "Perfil"}</Text>
      <View style={styles.profileBox}>
        <Text style={styles.profileLabel}>Email</Text>
        <Text style={styles.profileValue}>{user?.email || "-"}</Text>
      </View>
      <Field
        label="Meta diaria em minutos"
        value={goal}
        onChangeText={setGoal}
        keyboardType="numeric"
      />
      <PrimaryButton onPress={() => onSaveGoal(goal)} variant="secondary">
        Atualizar meta
      </PrimaryButton>

      <View style={styles.divider} />
      <Field
        label="Endereco do backend"
        value={apiUrl}
        onChangeText={setApiUrl}
        placeholder="http://10.0.2.2:8080"
      />
      <PrimaryButton onPress={onSaveApiUrl} variant="secondary">
        Salvar API
      </PrimaryButton>
      <PrimaryButton onPress={onLogout} variant="danger">
        Sair
      </PrimaryButton>
    </ScrollView>
  );
}

function ReadingSessionPanel({ session, endPage, setEndPage, elapsed, onFinish, onCancel, loading }) {
  if (!session) {
    return null;
  }

  return (
    <View style={styles.sessionPanel}>
      <View style={styles.sessionCard}>
        <Text style={styles.sessionEyebrow}>Sessao ativa</Text>
        <Text style={styles.sessionTitle}>{getBookTitle(session.book)}</Text>
        <Text style={styles.timer}>{formatTimer(elapsed)}</Text>
        <Field
          label="Pagina final"
          value={endPage}
          onChangeText={setEndPage}
          keyboardType="numeric"
        />
        <PrimaryButton onPress={onFinish} disabled={loading}>
          {loading ? "Finalizando..." : "Finalizar sessao"}
        </PrimaryButton>
        <PrimaryButton onPress={onCancel} variant="secondary">
          Continuar depois
        </PrimaryButton>
      </View>
    </View>
  );
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
  const [session, setSession] = useState(null);
  const [endPage, setEndPage] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [finishingSession, setFinishingSession] = useState(false);

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
    let intervalId;

    if (session) {
      setElapsed(0);
      intervalId = setInterval(() => {
        setElapsed((value) => value + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [session]);

  useEffect(() => {
    if (authenticated) {
      loadAppData();
    }
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
      if (error.status === 401) {
        await logout();
      }
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

  async function handleStartBook(book, activeReading) {
    try {
      const startPage = toNumber(activeReading?.currentPage, 0);
      const reading = await startReading(user.id, book.id, startPage);
      const sessions = await getSessionsByReadingId(reading.id);
      let currentSession = sortSessionsByStartDesc(sessions).find((item) => !item.endedAt);

      if (!currentSession) {
        currentSession = await startReadingSession(reading.id, startPage);
      }

      setSession({
        book,
        reading,
        readingId: reading.id,
        sessionId: currentSession.id,
        startPage
      });
      setEndPage(String(startPage));
    } catch (error) {
      Alert.alert("Leitura", getErrorMessage(error));
    }
  }

  async function handleFinishSession() {
    if (!session?.sessionId) {
      return;
    }

    const numericEndPage = Number(endPage);
    if (!Number.isFinite(numericEndPage) || numericEndPage < 0) {
      Alert.alert("Sessao", "Informe uma pagina final valida.");
      return;
    }

    setFinishingSession(true);
    try {
      await finishReadingSession(session.sessionId, numericEndPage);
      setSession(null);
      await loadAppData();
      Alert.alert("Sessao", "Sessao finalizada com sucesso.");
    } catch (error) {
      Alert.alert("Sessao", getErrorMessage(error));
    } finally {
      setFinishingSession(false);
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
    setSession(null);
  }

  if (booting) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <ActivityIndicator color="#406c54" />
        <Text style={styles.loadingText}>Carregando TimerBook...</Text>
      </SafeAreaView>
    );
  }

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ExpoStatusBar style="dark" />
        <AuthScreen
          apiUrl={apiUrl}
          setApiUrl={setApiUrl}
          onAuthenticated={handleAuthenticated}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />
      <View style={styles.appShell}>
        {activeTab === "home" && (
          <HomeScreen
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
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tab, active && styles.activeTab]}
            >
              <Text style={[styles.tabText, active && styles.activeTabText]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ReadingSessionPanel
        session={session}
        endPage={endPage}
        setEndPage={setEndPage}
        elapsed={elapsed}
        onFinish={handleFinishSession}
        onCancel={() => setSession(null)}
        loading={finishingSession}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f3ea",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appShell: {
    flex: 1
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f7f3ea"
  },
  loadingText: {
    marginTop: 12,
    color: "#5f5449",
    fontSize: 15
  },
  authContainer: {
    flex: 1
  },
  authContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24
  },
  brandMark: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#406c54",
    marginBottom: 18
  },
  brandInitial: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800"
  },
  authTitle: {
    color: "#27211d",
    fontSize: 34,
    fontWeight: "800"
  },
  authSubtitle: {
    color: "#675d52",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
    marginBottom: 24
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#e6ded2",
    borderRadius: 8,
    padding: 4,
    marginBottom: 18
  },
  segment: {
    flex: 1,
    minHeight: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6
  },
  segmentActive: {
    backgroundColor: "#ffffff"
  },
  segmentText: {
    color: "#675d52",
    fontWeight: "700"
  },
  segmentTextActive: {
    color: "#2f5944"
  },
  field: {
    marginBottom: 14
  },
  label: {
    color: "#3c352f",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#d7ccbd",
    borderRadius: 8,
    color: "#27211d",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    fontSize: 16
  },
  textArea: {
    minHeight: 104,
    paddingTop: 12,
    textAlignVertical: "top"
  },
  button: {
    minHeight: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#406c54",
    paddingHorizontal: 18,
    marginTop: 8
  },
  secondaryButton: {
    backgroundColor: "#ecf2ee",
    borderWidth: 1,
    borderColor: "#c8d8ce"
  },
  dangerButton: {
    backgroundColor: "#a6423b"
  },
  disabledButton: {
    opacity: 0.6
  },
  pressedButton: {
    transform: [{ scale: 0.99 }]
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800"
  },
  secondaryButtonText: {
    color: "#315942"
  },
  apiBox: {
    marginTop: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ded4c6",
    borderRadius: 8,
    backgroundColor: "#fdfaf4"
  },
  apiTitle: {
    color: "#4f463e",
    fontWeight: "800",
    marginBottom: 10
  },
  screenContent: {
    padding: 20,
    paddingBottom: 112
  },
  eyebrow: {
    color: "#406c54",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0
  },
  title: {
    color: "#27211d",
    fontSize: 30,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 18
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  statCard: {
    width: "48%",
    minHeight: 100,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4dbcf",
    padding: 14,
    justifyContent: "space-between"
  },
  statValue: {
    color: "#27211d",
    fontSize: 24,
    fontWeight: "800"
  },
  statLabel: {
    color: "#685f55",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 8
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  sectionTitle: {
    color: "#27211d",
    fontSize: 20,
    fontWeight: "800"
  },
  emptyState: {
    borderWidth: 1,
    borderColor: "#e2d8ca",
    borderRadius: 8,
    backgroundColor: "#fffdfa",
    padding: 18
  },
  emptyTitle: {
    color: "#27211d",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6
  },
  emptyDescription: {
    color: "#6b6258",
    lineHeight: 21
  },
  readingRow: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4dbcf",
    marginBottom: 10
  },
  readingTitle: {
    color: "#27211d",
    fontWeight: "800",
    fontSize: 16
  },
  readingMeta: {
    color: "#675d52",
    marginTop: 5
  },
  bookCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4dbcf",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12
  },
  cover: {
    width: 76,
    height: 108,
    borderRadius: 6,
    backgroundColor: "#e8dfd3"
  },
  coverFallback: {
    width: 76,
    height: 108,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#406c54"
  },
  coverFallbackText: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800"
  },
  bookInfo: {
    flex: 1
  },
  bookTitle: {
    color: "#27211d",
    fontSize: 17,
    fontWeight: "800"
  },
  bookDescription: {
    color: "#675d52",
    lineHeight: 20,
    marginTop: 5
  },
  progressBadge: {
    alignSelf: "flex-start",
    color: "#315942",
    backgroundColor: "#eaf3ed",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800"
  },
  inlineActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12
  },
  smallAction: {
    minHeight: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#406c54",
    paddingHorizontal: 16
  },
  smallActionText: {
    color: "#ffffff",
    fontWeight: "800"
  },
  smallDangerAction: {
    minHeight: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5e4e1",
    paddingHorizontal: 16
  },
  smallDangerText: {
    color: "#963d37",
    fontWeight: "800"
  },
  fileRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  fileButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#c8d8ce",
    backgroundColor: "#ecf2ee",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10
  },
  fileButtonText: {
    color: "#315942",
    fontWeight: "800",
    textAlign: "center"
  },
  profileBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e4dbcf",
    backgroundColor: "#ffffff",
    padding: 14,
    marginBottom: 18
  },
  profileLabel: {
    color: "#6b6258",
    fontWeight: "700",
    marginBottom: 4
  },
  profileValue: {
    color: "#27211d",
    fontSize: 16,
    fontWeight: "800"
  },
  divider: {
    height: 1,
    backgroundColor: "#ded4c6",
    marginVertical: 22
  },
  tabBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    minHeight: 64,
    borderRadius: 8,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ded4c6",
    padding: 6
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6
  },
  activeTab: {
    backgroundColor: "#406c54"
  },
  tabText: {
    color: "#6b6258",
    fontSize: 12,
    fontWeight: "800"
  },
  activeTabText: {
    color: "#ffffff"
  },
  sessionPanel: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(39, 33, 29, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  sessionCard: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#ffffff",
    padding: 18
  },
  sessionEyebrow: {
    color: "#406c54",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0,
    marginBottom: 5
  },
  sessionTitle: {
    color: "#27211d",
    fontSize: 22,
    fontWeight: "800"
  },
  timer: {
    color: "#27211d",
    fontSize: 42,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 18
  }
});
