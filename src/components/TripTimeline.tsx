import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TripStatus } from "../types";
import { colors } from "../theme/colors";

const steps: { key: TripStatus; label: string }[] = [
  { key: "driver_on_way", label: "En camino" },
  { key: "in_progress", label: "En curso" },
  { key: "completed", label: "Finalizado" },
  { key: "rated", label: "Calificado" },
];

export default function TripTimeline({ status }: { status: TripStatus }) {
  const currentIndex = Math.max(0, steps.findIndex((s) => s.key === status));
  return (
    <View style={styles.row}>
      {steps.map((step, index) => {
        const active = index <= currentIndex;
        return (
          <View key={step.key} style={styles.step}>
            <View style={[styles.dot, active && styles.activeDot]} />
            <Text style={[styles.label, active && styles.activeLabel]}>{step.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", gap: 6, marginBottom: 16, flexWrap: "wrap" },
  step: { flex: 1, minWidth: 68, alignItems: "center" },
  dot: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#CBD5E1", marginBottom: 6 },
  activeDot: { backgroundColor: colors.primary },
  label: { fontSize: 11, color: colors.textMuted, textAlign: "center", fontWeight: "800" },
  activeLabel: { color: colors.primaryDark },
});
