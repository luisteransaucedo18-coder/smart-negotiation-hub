import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function VerificationChecklist({ compact = false }: { compact?: boolean }) {
  const items = [
    "Identidad y licencia validadas",
    "Vehiculo, placa y color registrados",
    "Reconocimiento facial simulado",
    "Historial, puntualidad y cancelaciones evaluadas",
  ];
  return (
    <View style={[styles.box, compact && styles.compact]}>
      <Text style={styles.title}>Filtro de confianza activo</Text>
      {items.map((item) => (
        <Text key={item} style={styles.item}>Validado: {item}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.successSoft, padding: 13, borderRadius: 20, marginTop: 10, marginBottom: 8, borderWidth: 1, borderColor: "#B7E8CF" },
  compact: { padding: 10 },
  title: { color: colors.secondaryDark, fontWeight: "900", marginBottom: 5 },
  item: { color: colors.secondaryDark, fontWeight: "800", marginBottom: 3, lineHeight: 19 },
});
