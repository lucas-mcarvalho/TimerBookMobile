import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';

const getAuthStyles = (theme = darkTheme) => StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: theme.background
  },
  authContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24
  },
  
  // O "Card" central que imita o .login-form-card da web
  loginFormCard: {
    width: "100%",
    borderRadius: 20, 
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    padding: 24, 
    shadowColor: theme.cardShadow || "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, 
    shadowRadius: 15,
    elevation: 5,
  },
  
  // Cabeçalho e Logo
  logoBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20
  },
  authTitle: {
    color: theme.text,
    fontSize: 34, 
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  authSubtitle: {
    color: theme.subtext,
    fontSize: 17, 
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center"
  },
  
  // Controle Segmentado (Abas Entrar / Cadastrar)
  segmented: {
    flexDirection: "row",
    backgroundColor: theme.background, 
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24
  },
  segment: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8
  },
  segmentActive: {
    backgroundColor: theme.surface, 
    borderWidth: 1,
    borderColor: theme.border,
  },
  segmentText: {
    color: theme.subtext,
    fontWeight: "600",
    letterSpacing: 0.5
  },
  segmentTextActive: {
    color: theme.accent, // Usa o verde (#2ecc71) definido na sua paleta
    fontWeight: "800"
  },
  
  // Área da Foto de Perfil
  profilePhotoPicker: {
    minHeight: 84,
    borderWidth: 1.5,
    borderColor: theme.accent, // Borda tracejada em verde igual ao link web
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: theme.background,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    padding: 16,
    marginBottom: 20
  },
  profilePhotoPreview: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  profilePhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.background,
    borderWidth: 2,
    borderColor: theme.border,
    borderStyle: "dashed"
  },
  profilePhotoInitial: {
    color: theme.subtext,
    fontSize: 22,
    fontWeight: "800"
  },
  profilePhotoTextBox: {
    flex: 1
  },
  profilePhotoTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4
  },
  profilePhotoDescription: {
    color: theme.accent, // Texto verde sublinhado
    textDecorationLine: 'underline',
    fontSize: 13,
    lineHeight: 18
  },
  
  // Configuração da API (Extra do mobile)
  apiBox: {
    marginTop: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.background
  },
  apiTitle: {
    color: theme.subtext,
    fontWeight: "800",
    marginBottom: 10
  }
});

export default getAuthStyles;
