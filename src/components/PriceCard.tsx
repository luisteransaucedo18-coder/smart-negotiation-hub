import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = { suggestedPrice: number; minPrice?: number; maxPrice?: number; distanceKm: string; isPeakHour: boolean; safeNightMode?: boolean };

export default function PriceCard({ suggestedPrice, minPrice, maxPrice, distanceKm, isPeakHour, safeNightMode }: Props) {
  return (
    <View style={styles.box}>
      <View style={styles.topRow}>
        <View style={styles.priceGroup}>
          <Text style={styles.label}>Precio inteligente sugerido</Text>
          <Text style={styles.price}>S/ {suggestedPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.lockBadge}><Text style={styles.lockText}>cero sorpresas</Text></View>
      </View>
      <Text style={styles.help}>Calculado por distancia, horario y preferencia de seguridad. Distancia aprox.: {distanceKm} km.</Text>
      {typeof minPrice === "number" && typeof maxPrice === "number" && (
        <Text style={styles.range}>Rango justo para negociar: S/ {minPrice.toFixed(2)} - S/ {maxPrice.toFixed(2)}</Text>
      )}
      <View style={styles.factorRow}>
        <Text style={styles.factor}>{isPeakHour ? "Hora punta activa" : "Horario normal"}</Text>
        {safeNightMode && <Text style={styles.factor}>Viaje seguro nocturno</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.surface, borderRadius: 20, padding: 16, marginVertical: 12, borderWidth: 1, borderColor: colors.border },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  priceGroup: { flex: 1, minWidth: 180 },
  label: { color: colors.textMuted, fontWeight: "800", marginBottom: 4, fontSize: 12 },
  price: { fontSize: 29, fontWeight: "900", color: colors.text },
  help: { color: colors.textMuted, marginTop: 7, lineHeight: 20 },
  range: { marginTop: 8, color: colors.text, fontWeight: "900" },
  factorRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  factor: { backgroundColor: colors.primarySoft, color: colors.primaryDark, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, fontSize: 12 },
  lockBadge: { backgroundColor: colors.successSoft, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 20, borderWidth: 0 },
  lockText: { color: colors.secondaryDark, fontWeight: "900", fontSize: 11 },
});
