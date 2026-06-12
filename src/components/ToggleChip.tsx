import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

export default function ToggleChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.84} style={[styles.chip, active && styles.active]} onPress={onPress}>
      <Text style={[styles.text, active && styles.activeText]}>{active ? "OK " : ""}{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 999, marginRight: 8, marginBottom: 8 },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontWeight: "900", color: colors.textMuted, fontSize: 13 },
  activeText: { color: "#FFFFFF" },
});
