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
  badge: { borderRadius: 20, paddingVertical: 8, paddingHorizontal: 11, alignItems: "center", minWidth: 76, borderWidth: 0 },
  strong: { backgroundColor: colors.successSoft, borderColor: colors.successSoft },
  mid: { backgroundColor: colors.warningSoft, borderColor: colors.warningSoft },
  low: { backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft },
  score: { fontSize: 14, fontWeight: "900", color: colors.text },
  compactScore: { fontSize: 12 },
  label: { fontSize: 10, color: colors.textMuted, fontWeight: "800" },
});
