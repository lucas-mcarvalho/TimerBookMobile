import { StyleSheet, Platform, StatusBar } from 'react-native';
import { darkTheme } from './colors';

const getGlobalStyles = (theme = darkTheme) => StyleSheet.create({
  // ==========================================
  // CONFIGURAÇÕES GLOBAIS E ESTRUTURA
  // ==========================================
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appShell: {
    flex: 1
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.background
  },
  loadingText: {
    marginTop: 12,
    color: theme.subtext,
    fontSize: 15
  },
  screenContent: {
    padding: 20,
    paddingBottom: 112
  },

  // ==========================================
  // COMPONENTES DE PERFIL (WEB ALIGNED)
  // ==========================================
  profileImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: theme.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileImageDefault: {
    width: "60%",
    height: "60%",
    opacity: 0.6,
  },

  // ==========================================
  // INPUTS, FORMULÁRIOS E BOTÕES GLOBAIS
  // ==========================================
  field: {
    marginBottom: 14
  },
  label: {
    color: theme.subtext,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    color: theme.text,
    backgroundColor: theme.inputBg,
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
    backgroundColor: theme.accent,
    paddingHorizontal: 18,
    marginTop: 8
  },
  secondaryButton: {
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border
  },
  dangerButton: {
    backgroundColor: theme.danger
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
    color: theme.text
  },

  // ==========================================
  // ELEMENTOS COMUNS
  // ==========================================
  emptyState: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.surface,
    padding: 18
  },
  emptyTitle: {
    color: theme.text,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6
  },
  emptyDescription: {
    color: theme.subtext,
    lineHeight: 21
  },

  // ==========================================
  // ESTATÍSTICAS E CARDS
  // ==========================================
  statCard: {
    width: "47%",
    minHeight: 110,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  statValue: {
    color: theme.text,
    fontSize: 28,
    fontWeight: "900"
  },
  statLabel: {
    color: theme.subtext,
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 8
  },

  // ==========================================
  // NAVEGAÇÃO INFERIOR (TAB BAR)
  // ==========================================
  tabBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    minHeight: 64,
    borderRadius: 8,
    flexDirection: "row",
    backgroundColor: theme.tabBarBg,
    borderWidth: 1,
    borderColor: theme.tabBarBorder,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6
  },
  activeTab: {
    backgroundColor: theme.primary
  },
  tabText: {
    color: theme.subtext,
    fontSize: 12,
    fontWeight: "800"
  },
  activeTabText: {
    color: "#ffffff"
  },

  // ==========================================
  // SESSÃO DE LEITURA (CRONÔMETRO / READER)
  // ==========================================
  readerLoading: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
  },
  readerLoadingText: {
    marginTop: 12,
    color: theme.subtext,
    fontSize: 15
  },
});

export default getGlobalStyles;
