import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  originName: string;
  destinationName: string;
};

export default function TripMapPreview({ originName, destinationName }: Props) {
  return (
    <View style={styles.map}>
      <View style={styles.routeLine} />
      <View style={[styles.marker, styles.origin]}><Text style={styles.markerText}>A</Text></View>
      <View style={[styles.marker, styles.destination]}><Text style={styles.markerText}>B</Text></View>
      <View style={styles.card}>
        <Text style={styles.title}>Mapa básico del viaje</Text>
        <Text style={styles.text}>Origen: {originName}</Text>
        <Text style={styles.text}>Destino: {destinationName}</Text>
        <Text style={styles.note}>Vista simulada. Se puede reemplazar por react-native-maps.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#BFDBFE",
    marginBottom: 18,
    justifyContent: "center",
    padding: 18,
  },
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
  title: { color: colors.text, fontWeight: "900", fontSize: 16, marginBottom: 6 },
  text: { color: "#334155", marginBottom: 3, fontWeight: "700" },
  note: { color: colors.textMuted, marginTop: 6, fontSize: 12, lineHeight: 17 },
});
