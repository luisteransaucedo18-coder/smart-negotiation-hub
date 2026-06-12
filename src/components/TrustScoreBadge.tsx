import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function TrustScoreBadge({ score, compact = false }: { score: number; compact?: boolean }) {
  const strong = score >= 85;
  const mid = score >= 70;
  return (
    <View style={[styles.badge, strong ? styles.strong : mid ? styles.mid : styles.low]}>
      <Text style={[styles.score, compact && styles.compactScore]}>{score}/100</Text>
      {!compact && <Text style={styles.label}>Confianza</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, alignItems: "center", minWidth: 76, borderWidth: 1 },
  strong: { backgroundColor: colors.successSoft, borderColor: "#B7E8CF" },
  mid: { backgroundColor: colors.warningSoft, borderColor: "#FDE68A" },
  low: { backgroundColor: colors.dangerSoft, borderColor: "#FDA4AF" },
  score: { fontSize: 14, fontWeight: "900", color: colors.text },
  compactScore: { fontSize: 12 },
  label: { fontSize: 10, color: colors.textMuted, fontWeight: "800" },
});
