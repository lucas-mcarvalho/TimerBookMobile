import { StyleSheet, Platform, StatusBar } from 'react-native';

const globalStyles = StyleSheet.create({
  // ==========================================
  // CONFIGURAÇÕES GLOBAIS E ESTRUTURA
  // ==========================================
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1221",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  appShell: {
    flex: 1
  },
  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0b1221"
  },
  loadingText: {
    marginTop: 12,
    color: "#a0aec0",
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
    borderColor: "#fff",
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
    color: "#a0aec0",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: "#1e2f4c",
    borderRadius: 8,
    color: "#ffffff",
    backgroundColor: "#0b1221",
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
    backgroundColor: "#2ecc71",
    paddingHorizontal: 18,
    marginTop: 8
  },
  secondaryButton: {
    backgroundColor: "#0b1221",
    borderWidth: 1,
    borderColor: "#1e2f4c"
  },
  dangerButton: {
    backgroundColor: "#ff4757"
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
    color: "#ffffff"
  },

  // ==========================================
  // ELEMENTOS COMUNS
  // ==========================================
  emptyState: {
    borderWidth: 1,
    borderColor: "#1e2f4c",
    borderRadius: 8,
    backgroundColor: "#121e31",
    padding: 18
  },
  emptyTitle: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 6
  },
  emptyDescription: {
    color: "#a0aec0",
    lineHeight: 21
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
    backgroundColor: "#121e31",
    borderWidth: 1,
    borderColor: "#1e2f4c",
    padding: 6
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6
  },
  activeTab: {
    backgroundColor: "#2b5292"
  },
  tabText: {
    color: "#a0aec0",
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
    backgroundColor: "#0b1221",
    alignItems: "center",
    justifyContent: "center",
  },
  readerLoadingText: {
    marginTop: 12,
    color: "#a0aec0",
    fontSize: 15
  },
});

export default globalStyles;
