import { StyleSheet } from 'react-native';

const homeStyles = StyleSheet.create({
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
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16
  },
  statCard: {
    width: "47%",
    minHeight: 110,
    borderRadius: 16,
    backgroundColor: "#121e31",
    borderWidth: 1,
    borderColor: "#1e2f4c",
    padding: 16,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  statValue: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "900"
  },
  statLabel: {
    color: "#a0aec0",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginTop: 8
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800"
  },
  readingRow: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#121e31",
    borderWidth: 1,
    borderColor: "#1e2f4c",
    marginBottom: 10
  },
  readingTitle: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16
  },
  readingMeta: {
    color: "#a0aec0",
    marginTop: 5
  },
});

export default homeStyles;
