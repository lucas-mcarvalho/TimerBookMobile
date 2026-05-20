import { StyleSheet } from 'react-native';

const authStyles = StyleSheet.create({
  authContainer: {
    flex: 1,
    backgroundColor: "#0b1221"
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
    borderColor: "#1e2f4c",
    backgroundColor: "#121e31",
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
  brandMark: {
    width: 60,
    height: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2b5292",
    borderWidth: 2,
    borderColor: "#1a365d",
    shadowColor: "#2b5292",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  brandInitial: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1,
  },
  authTitle: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  authSubtitle: {
    color: "#a0aec0",
    fontSize: 17,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: "center"
  },
  segmented: {
    flexDirection: "row",
    backgroundColor: "#060b14",
    borderWidth: 1,
    borderColor: "#1e2f4c",
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
    backgroundColor: "#2b5292",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  segmentText: {
    color: "#64748b",
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
    borderColor: "#2b5292",
    borderStyle: "dashed",
    borderRadius: 16,
    backgroundColor: "rgba(43, 82, 146, 0.05)",
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
    backgroundColor: "#121e31",
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
    backgroundColor: "#2b5292",
    borderWidth: 2,
    borderColor: "#1a365d"
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
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4
  },
  profilePhotoDescription: {
    color: "#94a3b8",
    fontSize: 13,
    lineHeight: 18
  },
  apiBox: {
    marginTop: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e2f4c",
    borderRadius: 8,
    backgroundColor: "#0b1221"
  },
  apiTitle: {
    color: "#a0aec0",
    fontWeight: "800",
    marginBottom: 10
  },
});

export default authStyles;
