import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { colors } from "../theme/colors";

type Props = { originLat: number; originLng: number; destinationLat: number; destinationLng: number; originName: string; destinationName: string };

export default function TripMap({ originLat, originLng, destinationLat, destinationLng, originName, destinationName }: Props) {
  const origin = { latitude: originLat, longitude: originLng };
  const destination = { latitude: destinationLat, longitude: destinationLng };
  const center = { latitude: (originLat + destinationLat) / 2, longitude: (originLng + destinationLng) / 2 };
  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ latitude: center.latitude, longitude: center.longitude, latitudeDelta: 0.045, longitudeDelta: 0.045 }}>
        <Marker coordinate={origin} title="Origen" description={originName} />
        <Marker coordinate={destination} title="Destino" description={destinationName} />
        <Polyline coordinates={[origin, destination]} strokeColor={colors.primary} strokeWidth={4} />
      </MapView>
      <View style={styles.floatingBox}>
        <Text style={styles.title}>Ruta del viaje</Text>
        <Text style={styles.text}>A: {originName}</Text>
        <Text style={styles.text}>B: {destinationName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 290, borderRadius: 26, overflow: "hidden", marginBottom: 16, backgroundColor: colors.primarySoft },
  map: { flex: 1 },
  floatingBox: { position: "absolute", left: 14, right: 14, bottom: 14, backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 18, padding: 14 },
  title: { color: colors.text, fontWeight: "900", marginBottom: 4 },
  text: { color: colors.textMuted, fontSize: 13, marginBottom: 2 },
});
