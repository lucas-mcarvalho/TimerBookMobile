import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';

const getHomeStyles = (theme = darkTheme) => StyleSheet.create({
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 20,
    fontWeight: "800"
  },
  readingRow: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 10
  },
  readingTitle: {
    color: theme.text,
    fontWeight: "800",
    fontSize: 16
  },
  readingMeta: {
    color: theme.subtext,
    marginTop: 5
  },
});

export default getHomeStyles;
