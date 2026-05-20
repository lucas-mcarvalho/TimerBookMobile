import { StyleSheet } from 'react-native';

const profileStyles = StyleSheet.create({
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
  profileBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1e2f4c",
    backgroundColor: "#121e31",
    padding: 14,
    marginBottom: 18
  },
  profileLabel: {
    color: "#a0aec0",
    fontWeight: "700",
    marginBottom: 4
  },
  profileValue: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800"
  },
  divider: {
    height: 1,
    backgroundColor: "#1e2f4c",
    marginVertical: 22
  },
});

export default profileStyles;
