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
  box: { backgroundColor: colors.cyanSoft, borderRadius: 12, padding: 16, marginVertical: 12, borderWidth: 1, borderColor: "#A5F3FC" },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  priceGroup: { flex: 1, minWidth: 180 },
  label: { color: colors.primaryDark, fontWeight: "900", marginBottom: 4 },
  price: { fontSize: 29, fontWeight: "900", color: colors.text },
  help: { color: colors.textMuted, marginTop: 7, lineHeight: 20 },
  range: { marginTop: 8, color: colors.primaryDark, fontWeight: "900" },
  factorRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  factor: { backgroundColor: colors.surface, color: colors.primaryDark, fontWeight: "800", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, fontSize: 12 },
  lockBadge: { backgroundColor: colors.successSoft, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: "#B7E8CF" },
  lockText: { color: colors.secondaryDark, fontWeight: "900", fontSize: 11 },
});
