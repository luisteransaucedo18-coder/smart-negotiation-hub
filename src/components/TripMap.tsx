import React from "react";
import { ImageBackground, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";

const mapReference = require("../../assets/images/map-reference.png");

type Props = {
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
};

export default function TripMap(props: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;

  return (
    <ImageBackground source={mapReference} style={[styles.map, compact && styles.compactMap]} imageStyle={styles.mapImage}>
      <View style={styles.routeLine} />
      <View style={[styles.marker, styles.origin]}><Text style={styles.markerText}>A</Text></View>
      <View style={[styles.marker, styles.destination]}><Text style={styles.markerText}>B</Text></View>
      <View style={[styles.card, compact && styles.compactCard]}>
        <Text style={styles.title}>Mapa del viaje</Text>
        <Text style={styles.text}>Origen: {props.originName}</Text>
        <Text style={styles.text}>Destino: {props.destinationName}</Text>
        <Text style={styles.note}>Vista web simulada. En celular se muestra el mapa real.</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  map: { height: 240, borderRadius: 20, overflow: "hidden", backgroundColor: "#EAF3FF", marginBottom: 18, justifyContent: "center", padding: 18, borderWidth: 1, borderColor: colors.border },
  compactMap: { height: 200, padding: 12, marginBottom: 14 },
  mapImage: { borderRadius: 20 },
  routeLine: { position: "absolute", width: 4, height: 150, left: 58, top: 45, borderRadius: 999, backgroundColor: colors.primary, transform: [{ rotate: "35deg" }] },
  marker: { position: "absolute", width: 42, height: 42, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, borderWidth: 3, borderColor: "#FFFFFF" },
  origin: { left: 34, top: 48 },
  destination: { left: 95, bottom: 44, backgroundColor: colors.secondary },
  markerText: { color: "#FFFFFF", fontWeight: "900" },
  card: { backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 20, padding: 16, marginLeft: 110, flexShrink: 1 },
  compactCard: { padding: 12, marginLeft: 82 },
  title: { color: colors.text, fontWeight: "900", fontSize: 16, marginBottom: 6 },
  text: { color: "#334155", marginBottom: 3, fontWeight: "700" },
  note: { color: colors.textMuted, marginTop: 6, fontSize: 12, lineHeight: 17 },
});
