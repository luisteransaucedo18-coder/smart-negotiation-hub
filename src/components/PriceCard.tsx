import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = { suggestedPrice: number; minPrice?: number; maxPrice?: number; distanceKm: string; isPeakHour: boolean; safeNightMode?: boolean };

export default function PriceCard({ suggestedPrice, minPrice, maxPrice, distanceKm, isPeakHour, safeNightMode }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>Precio sugerido</Text>
      <Text style={styles.price}>S/ {suggestedPrice.toFixed(2)}</Text>
      <Text style={styles.help}>Distancia aprox.: {distanceKm} km · {isPeakHour ? "Hora punta" : "Horario normal"}</Text>
      {typeof minPrice === "number" && typeof maxPrice === "number" && (
        <Text style={styles.range}>Rango recomendado: S/ {minPrice.toFixed(2)} - S/ {maxPrice.toFixed(2)}</Text>
      )}
      {safeNightMode && <Text style={styles.safe}>Modo viaje seguro nocturno activo</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.cyanSoft, borderRadius: 18, padding: 16, marginVertical: 12 },
  label: { color: colors.primaryDark, fontWeight: "900", marginBottom: 4 },
  price: { fontSize: 31, fontWeight: "900", color: colors.text },
  help: { color: colors.textMuted, marginTop: 5 },
  range: { marginTop: 8, color: colors.primaryDark, fontWeight: "800" },
  safe: { marginTop: 8, color: colors.secondaryDark, fontWeight: "900" },
});
