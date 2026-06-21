import { StyleSheet } from "react-native";

export default function getAssinaturaStyles(theme) {
  // Garantindo cores de fallback caso algo não venha no theme
  const textColor = theme.text || "#1a1a1a";
  const subtextColor = theme.subtext || "#64748b";
  const accentColor = theme.accent || "#0066FF";
  const surfaceColor = theme.surface || "#ffffff";
  const borderColor = theme.border || "#e2e8f0";

  return StyleSheet.create({
    scrollContainer: {
      padding: 20,
      paddingBottom: 130, // Espaço extra essencial para a barra fixa não tampar o último card
    },
    header: {
      marginBottom: 24,
    },
    kicker: {
      fontSize: 12,
      fontWeight: "700",
      color: accentColor,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginBottom: 6,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: textColor,
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
      color: subtextColor,
      lineHeight: 24,
    },
    statusBox: {
      backgroundColor: theme.surfaceVariant || "rgba(0, 0, 0, 0.03)",
      padding: 20,
      borderRadius: 16,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: borderColor,
    },
    statusLabel: {
      fontSize: 14,
      color: subtextColor,
      marginBottom: 4,
    },
    statusValue: {
      fontSize: 22,
      fontWeight: "bold",
      color: textColor,
    },
    statusSubtext: {
      fontSize: 13,
      color: subtextColor,
      marginTop: 4,
    },
    actionButtonsRow: {
      flexDirection: "row",
      marginTop: 16,
    },
    plansGrid: {
      gap: 16, // Espaçamento entre os cards (funciona no React Native moderno)
    },
    planCard: {
      backgroundColor: surfaceColor,
      padding: 24,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: borderColor,
      position: "relative",
      marginBottom: 18,
    },
    planCardSelected: {
      borderColor: accentColor,
      backgroundColor: theme.surfaceHighlight || "rgba(0, 102, 255, 0.05)",
    },
    selectedBadge: {
      position: 'absolute',
      top: 12,
      left: 12,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 4,
    },
    selectedBadgeText: {
      color: '#fff',
      fontWeight: '800',
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      color: accentColor,
      fontWeight: '700',
    },
    badge: {
      position: "absolute",
      top: -12,
      right: 20,
      backgroundColor: accentColor,
      paddingVertical: 4,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    badgeText: {
      color: "#ffffff",
      fontSize: 12,
      fontWeight: "bold",
    },
    planName: {
      fontSize: 20,
      fontWeight: "bold",
      color: textColor,
      marginBottom: 6,
    },
    planDescription: {
      fontSize: 14,
      color: subtextColor,
      lineHeight: 20,
      marginBottom: 16,
    },
    priceRow: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: 20,
    },
    planPrice: {
      fontSize: 32,
      fontWeight: "900",
      color: textColor,
    },
    planPeriod: {
      fontSize: 16,
      color: subtextColor,
      fontWeight: "500",
    },
    featuresList: {
      marginTop: 8,
    },
    featureRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    featureCheck: {
      color: accentColor,
      fontWeight: "bold",
      fontSize: 16,
      marginRight: 10,
    },
    featureText: {
      color: textColor,
      fontSize: 15,
    },
    // --- STICKY BOTTOM BAR ---
    stickyBottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: surfaceColor,
      borderTopWidth: 1,
      borderTopColor: borderColor,
      paddingHorizontal: 20,
      paddingVertical: 16,
      // Sombra para iOS
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      // Sombra para Android
      elevation: 10,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    summaryLabel: {
      fontSize: 13,
      color: subtextColor,
      marginBottom: 2,
    },
    summaryPrice: {
      fontSize: 24,
      fontWeight: "bold",
      color: textColor,
    },
  });
}