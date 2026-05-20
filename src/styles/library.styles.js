import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';

const getLibraryStyles = (theme = darkTheme) => StyleSheet.create({
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  title: {
    color: theme.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 24,
    letterSpacing: -0.5
  },
  eyebrow: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5
  },
  bookCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cover: {
    width: 80,
    height: 115,
    borderRadius: 12,
    backgroundColor: theme.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  coverFallback: {
    width: 80,
    height: 115,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.primary
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
    color: theme.text,
    fontSize: 17,
    fontWeight: "800"
  },
  bookDescription: {
    color: theme.subtext,
    lineHeight: 20,
    marginTop: 5
  },
  progressBadge: {
    alignSelf: "flex-start",
    color: theme.accent,
    backgroundColor: theme.accent + "1A", // 10% opacity
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
    backgroundColor: theme.accent,
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
    backgroundColor: theme.danger + "1F", // 12% opacity
    paddingHorizontal: 16
  },
  smallDangerText: {
    color: theme.danger,
    fontWeight: "800"
  },
});

export default getLibraryStyles;
