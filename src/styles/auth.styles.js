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
  loginFormCard: {
    width: "100%",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 25,
    elevation: 10,
  },
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
  segmented: {
    flexDirection: "row",
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 16,
    padding: 6,
    marginBottom: 24
  },
  segment: {
    flex: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10
  },
  segmentActive: {
    backgroundColor: theme.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  segmentText: {
    color: theme.subtext,
    fontWeight: "600",
    letterSpacing: 0.5
  },
  segmentTextActive: {
    color: "#ffffff",
    fontWeight: "800"
  },
  profilePhotoPicker: {
    minHeight: 84,
    borderWidth: 1.5,
    borderColor: theme.primary,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  profilePhotoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary,
    borderWidth: 2,
    borderColor: theme.border
  },
  profilePhotoInitial: {
    color: "#ffffff",
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
    color: theme.subtext,
    fontSize: 13,
    lineHeight: 18
  },
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
  },
});

export default getAuthStyles;
