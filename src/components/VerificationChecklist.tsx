import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function VerificationChecklist({ compact = false }: { compact?: boolean }) {
  const items = [
    "Identidad verificada",
    "Vehículo registrado",
    "Reconocimiento facial validado",
    "Historial y cancelaciones evaluadas",
  ];
  return (
    <View style={[styles.box, compact && styles.compact]}>
      {items.map((item) => (
        <Text key={item} style={styles.item}>✓ {item}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.successSoft, padding: 13, borderRadius: 15, marginTop: 10, marginBottom: 8 },
  compact: { padding: 10 },
  item: { color: colors.secondaryDark, fontWeight: "800", marginBottom: 3, lineHeight: 19 },
});
