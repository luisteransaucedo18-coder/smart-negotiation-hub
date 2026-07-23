import React from "react";
import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  originName: string;
  destinationName: string;
};

const mapReference = require("../../assets/images/map-reference.png");

export default function TripMapPreview({ originName, destinationName }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;

  return (
    <ImageBackground source={mapReference} style={[styles.map, compact && styles.compactMap]} imageStyle={styles.mapImage}>
      <View style={styles.routeLine} />
      <View style={[styles.marker, styles.origin]}><Text style={styles.markerText}>A</Text></View>
      <View style={[styles.marker, styles.destination]}><Text style={styles.markerText}>B</Text></View>
      <View style={[styles.card, compact && styles.compactCard]}>
        <Text style={styles.title}>Mapa referencial del viaje</Text>
        <Text style={styles.text}>Origen: {originName}</Text>
        <Text style={styles.text}>Destino: {destinationName}</Text>
        <Text style={styles.note}>Imagen de referencia para visualizar la ruta.</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#BFDBFE",
    marginBottom: 18,
    justifyContent: "center",
    padding: 18,
  },
  compactMap: {
    height: 200,
    padding: 12,
  },
  mapImage: { borderRadius: 20 },
  routeLine: {
    position: "absolute",
    width: 4,
    height: 150,
    left: 58,
    top: 45,
    borderRadius: 999,
    backgroundColor: colors.primary,
    transform: [{ rotate: "35deg" }],
  },
  marker: {
    position: "absolute",
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  origin: { left: 34, top: 48 },
  destination: { left: 95, bottom: 44, backgroundColor: colors.danger },
  markerText: { color: "#FFFFFF", fontWeight: "900" },
  card: {
    backgroundColor: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 16,
    marginLeft: 120,
  },
  compactCard: {
    padding: 12,
    marginLeft: 82,
  },
  title: { color: colors.text, fontWeight: "900", fontSize: 16, marginBottom: 6 },
  text: { color: "#334155", marginBottom: 3, fontWeight: "700" },
  note: { color: colors.textMuted, marginTop: 6, fontSize: 12, lineHeight: 17 },
});
