import { StyleSheet } from 'react-native';
import { darkTheme } from './colors';

const getProfileStyles = (theme = darkTheme) => StyleSheet.create({
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
  photoEditButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: theme.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
    backgroundColor: theme.surface,
    padding: 14,
    marginBottom: 18
  },
  profileLabel: {
    color: theme.subtext,
    fontWeight: "700",
    marginBottom: 4
  },
  profileValue: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "800"
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 22
  },
  themeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
    marginBottom: 18
  },
  themeLabel: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "700"
  }
});

export default getProfileStyles;
