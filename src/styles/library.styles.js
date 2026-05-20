import { StyleSheet } from 'react-native';

const libraryStyles = StyleSheet.create({
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12
  },
  title: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "800",
    marginTop: 4,
    marginBottom: 24,
    letterSpacing: -0.5
  },
  eyebrow: {
    color: "#2ecc71",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.5
  },
  bookCard: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#121e31",
    borderWidth: 1,
    borderColor: "#1e2f4c",
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
    backgroundColor: "#0b1221",
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
    backgroundColor: "#2b5292"
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
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "800"
  },
  bookDescription: {
    color: "#a0aec0",
    lineHeight: 20,
    marginTop: 5
  },
  progressBadge: {
    alignSelf: "flex-start",
    color: "#2ecc71",
    backgroundColor: "rgba(46, 204, 113, 0.1)",
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
    backgroundColor: "#2ecc71",
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
    backgroundColor: "rgba(255, 71, 87, 0.12)",
    paddingHorizontal: 16
  },
  smallDangerText: {
    color: "#ff4757",
    fontWeight: "800"
  },
});

export default libraryStyles;
