import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = { originLat: number; originLng: number; destinationLat: number; destinationLng: number; originName: string; destinationName: string };

export default function TripMap({ originName, destinationName }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mapArea}>
        <View style={styles.pointA}><Text style={styles.pointText}>A</Text></View>
        <View style={styles.routeLine} />
        <View style={styles.pointB}><Text style={styles.pointText}>B</Text></View>
        <Text style={styles.title}>Mapa del viaje</Text>
        <Text style={styles.subtitle}>Vista compatible con web. En celular se muestra mapa real.</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Ruta</Text>
        <Text style={styles.infoText}>A: {originName}</Text>
        <Text style={styles.infoText}>B: {destinationName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 290, borderRadius: 26, overflow: "hidden", marginBottom: 16, backgroundColor: colors.surface },
  mapArea: { minHeight: 220, backgroundColor: "#DDF4FF", alignItems: "center", justifyContent: "center", position: "relative" },
  title: { fontSize: 23, fontWeight: "900", color: colors.primaryDark },
  subtitle: { marginTop: 6, color: colors.textMuted, textAlign: "center" },
  pointA: { position: "absolute", left: 42, top: 48, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  pointB: { position: "absolute", right: 42, bottom: 48, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.danger, alignItems: "center", justifyContent: "center" },
  pointText: { color: "#FFFFFF", fontWeight: "900" },
  routeLine: { position: "absolute", width: "58%", height: 4, backgroundColor: colors.primary, transform: [{ rotate: "24deg" }], opacity: 0.8 },
  infoBox: { backgroundColor: "#FFFFFF", padding: 16 },
  infoTitle: { fontSize: 15, fontWeight: "900", color: colors.text, marginBottom: 4 },
  infoText: { color: colors.textMuted, marginBottom: 2 },
});
