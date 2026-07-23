import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const mapReference = require("../../assets/images/map-reference.png");

type Props = { originLat: number; originLng: number; destinationLat: number; destinationLng: number; originName: string; destinationName: string };

export default function TripMap({ originName, destinationName }: Props) {
  return (
    <View style={styles.container}>
      <ImageBackground source={mapReference} style={styles.mapArea} imageStyle={styles.mapImage}>
        <View style={styles.pointA}><Text style={styles.pointText}>A</Text></View>
        <View style={styles.routeLine} />
        <View style={styles.pointB}><Text style={styles.pointText}>B</Text></View>
        <Text style={styles.title}>Mapa del viaje</Text>
        <Text style={styles.subtitle}>Referencia visual de la ruta.</Text>
      </ImageBackground>
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Ruta</Text>
        <Text style={styles.infoText}>A: {originName}</Text>
        <Text style={styles.infoText}>B: {destinationName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 290, borderRadius: 20, overflow: "hidden", marginBottom: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  mapArea: { minHeight: 220, backgroundColor: "#EAF3FF", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  mapImage: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 23, fontWeight: "900", color: colors.primaryDark, backgroundColor: "rgba(255,255,255,0.82)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, overflow: "hidden" },
  subtitle: { marginTop: 6, color: colors.textMuted, textAlign: "center", backgroundColor: "rgba(255,255,255,0.82)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, overflow: "hidden" },
  pointA: { position: "absolute", left: 42, top: 48, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  pointB: { position: "absolute", right: 42, bottom: 48, width: 38, height: 38, borderRadius: 19, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  pointText: { color: "#FFFFFF", fontWeight: "900" },
  routeLine: { position: "absolute", width: "58%", height: 5, backgroundColor: colors.primary, transform: [{ rotate: "24deg" }], opacity: 0.85, borderRadius: 999 },
  infoBox: { backgroundColor: "#FFFFFF", padding: 16 },
  infoTitle: { fontSize: 15, fontWeight: "900", color: colors.text, marginBottom: 4 },
  infoText: { color: colors.textMuted, marginBottom: 2 },
});
