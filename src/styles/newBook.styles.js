import { StyleSheet } from 'react-native';

const newBookStyles = StyleSheet.create({
  eyebrow: {
    color: "#2ecc71",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5
  },
  title: {
    color: "#ffffff",
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
    borderColor: "#1e2f4c",
    backgroundColor: "#121e31",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    borderStyle: "dashed",
  },
  fileButtonText: {
    color: "#ffffff",
    fontWeight: "800",
    textAlign: "center"
  },
});

export default newBookStyles;
