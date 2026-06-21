import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';

const getNewBookStyles = (theme = darkTheme) => StyleSheet.create({
  eyebrow: {
    color: theme.accent,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5
  },
  title: {
    color: theme.text,
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 24,
    letterSpacing: -0.5
  },
  fileRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  fileButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderStyle: "dashed",
  },
  fileButtonText: {
    color: theme.text,
    fontWeight: "800",
    textAlign: "center"
  },
});

export default getNewBookStyles;
