import React from "react";
import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";

type Props = { originLat: number; originLng: number; destinationLat: number; destinationLng: number; originName: string; destinationName: string };
const mapReference = require("../../assets/images/map-reference.png");

export default function TripMap({ originName, destinationName }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;

  return (
    <View style={[styles.container, compact && styles.compactContainer]}>
      <ImageBackground source={mapReference} style={styles.map} imageStyle={styles.mapImage}>
        <View style={[styles.marker, styles.origin]}><Text style={styles.markerText}>A</Text></View>
        <View style={[styles.marker, styles.destination]}><Text style={styles.markerText}>B</Text></View>
      </ImageBackground>
      <View style={[styles.floatingBox, compact && styles.compactFloatingBox]}>
        <Text style={styles.title}>Ruta del viaje</Text>
        <Text style={styles.text}>A: {originName}</Text>
        <Text style={styles.text}>B: {destinationName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 290, borderRadius: 20, overflow: "hidden", marginBottom: 16, backgroundColor: colors.primarySoft },
  compactContainer: { height: 230, marginBottom: 12 },
  map: { flex: 1 },
  mapImage: { borderRadius: 20 },
  marker: { position: "absolute", width: 42, height: 42, borderRadius: 999, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  origin: { left: 42, top: 52, backgroundColor: colors.primary },
  destination: { right: 42, bottom: 92, backgroundColor: colors.secondary },
  markerText: { color: "#FFFFFF", fontWeight: "900" },
  floatingBox: { position: "absolute", left: 14, right: 14, bottom: 14, backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 20, padding: 14 },
  compactFloatingBox: { left: 10, right: 10, bottom: 10, padding: 11 },
  title: { color: colors.text, fontWeight: "900", marginBottom: 4 },
  text: { color: colors.textMuted, fontSize: 13, marginBottom: 2 },
});
