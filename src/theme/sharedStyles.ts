import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const sharedStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 24, paddingTop: 18, paddingBottom: 112 },
  title: { fontSize: 28, fontWeight: "900", color: colors.text, marginTop: 4, marginBottom: 8, lineHeight: 35 },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 20, lineHeight: 21 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, marginBottom: 10, lineHeight: 24 },
  label: { fontSize: 12, fontWeight: "800", color: colors.textMuted, marginBottom: 8 },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 15,
    fontSize: 16,
    marginBottom: 8,
    color: colors.text,
  },
  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  text: { fontSize: 15, color: colors.textMuted, marginBottom: 6, lineHeight: 21 },
  muted: { color: colors.textMuted, lineHeight: 20 },
  fieldHelp: { fontSize: 12, color: colors.textMuted, marginTop: -2, marginBottom: 12, lineHeight: 17 },
  fieldError: { fontSize: 12, color: colors.danger, marginTop: -2, marginBottom: 12, lineHeight: 17, fontWeight: "700" },
  fieldOk: { fontSize: 12, color: colors.success, marginTop: -2, marginBottom: 12, lineHeight: 17, fontWeight: "700" },
});
