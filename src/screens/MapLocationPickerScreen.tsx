import React, { useEffect, useState } from "react";
import { Alert, ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";
import type { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";
import { getCurrentRoutePoint, reverseGeocodePoint } from "../services/locationService";

type Props = {
  target: LocationTarget;
  initialPoint: RoutePoint;
  onCancel: () => void;
  onSelect: (point: RoutePoint) => void;
};

const mapReference = require("../../assets/images/map-reference.png");

export default function MapLocationPickerScreen({ target, initialPoint, onCancel, onSelect }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint>(initialPoint);
  const [referenceName, setReferenceName] = useState(initialPoint.name || "");
  const [hotspot, setHotspot] = useState({ x: target === "origin" ? 24 : 72, y: target === "origin" ? 58 : 34 });
  const isOrigin = target === "origin";

  useEffect(() => {
    let mounted = true;
    async function loadCurrentLocation() {
      if (!isOrigin) return;
      const current = await getCurrentRoutePoint();
      if (!mounted || !current) return;
      setSelectedPoint(current);
      setReferenceName(current.name);
      setHotspot({ x: 24, y: 58 });
    }
    loadCurrentLocation();
    return () => { mounted = false; };
  }, [isOrigin]);

  function selectQuickPoint(point: RoutePoint) {
    setSelectedPoint(point);
    setReferenceName(point.name);
    setHotspot({ x: 50, y: 50 });
  }

  async function moveHotspot(x: number, y: number) {
    setHotspot({ x, y });
    const latitude = selectedPoint.latitude + ((50 - y) / 50) * 0.01;
    const longitude = selectedPoint.longitude + ((x - 50) / 50) * 0.01;
    const fallback = `Lat. ${latitude.toFixed(5)}, Lng. ${longitude.toFixed(5)}`;
    setSelectedPoint({ latitude, longitude, name: fallback });
    setReferenceName(fallback);
    const address = await reverseGeocodePoint(latitude, longitude);
    setSelectedPoint({ latitude, longitude, name: address });
    setReferenceName(address);
  }

  function handleConfirm() {
    const cleanReference = referenceName.trim();
    if (!cleanReference) {
      Alert.alert("Falta referencia", "Escribe una calle, avenida o lugar de referencia.");
      return;
    }
    onSelect({ name: cleanReference, latitude: selectedPoint.latitude, longitude: selectedPoint.longitude });
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, compact && styles.compactContainer]} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, compact && styles.compactTitle]}>{isOrigin ? "Elegir origen" : "Elegir destino"}</Text>
      <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>Usa el mapa referencial y confirma una referencia visible para el viaje.</Text>

      <View style={[styles.mapCard, compact && styles.compactMapCard]}>
        <ImageBackground source={mapReference} style={styles.map} imageStyle={styles.mapImage}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={StyleSheet.absoluteFill}
            onPress={(event) => {
              const x = Math.max(8, Math.min(92, (event.nativeEvent.locationX / 342) * 100));
              const y = Math.max(8, Math.min(92, (event.nativeEvent.locationY / 300) * 100));
              moveHotspot(x, y);
            }}
          >
          <View style={[styles.marker, isOrigin ? styles.originMarker : styles.destinationMarker, { left: `${hotspot.x}%`, top: `${hotspot.y}%` }]}>
            <Text style={styles.markerText}>{isOrigin ? "A" : "B"}</Text>
          </View>
          </TouchableOpacity>
        </ImageBackground>
        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayTitle}>{isOrigin ? "Origen" : "Destino"}</Text>
          <Text style={styles.mapOverlayText}>{referenceName.trim() || selectedPoint.name || "Elige un punto y escribe una referencia"}</Text>
        </View>
      </View>

      <View style={[styles.card, compact && styles.compactCard]}>
        <Text style={styles.sectionTitle}>Puntos rapidos en Trujillo</Text>
        <View style={styles.quickGrid}>
          {TRUJILLO_POINTS.map((point) => {
            const active = point.latitude === selectedPoint.latitude && point.longitude === selectedPoint.longitude;
            return (
              <TouchableOpacity key={point.name} style={[styles.quickChip, active && styles.quickChipActive]} onPress={() => selectQuickPoint(point)}>
                <Text style={[styles.quickText, active && styles.quickTextActive]}>{point.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, compact && styles.compactCard]}>
        <Text style={styles.sectionTitle}>Direccion o referencia visible</Text>
        <Text style={styles.helperText}>Esto vera la otra persona. Usa una referencia clara, no solo coordenadas.</Text>
        <TextInput
          style={styles.input}
          value={referenceName}
          onChangeText={(value) => {
            setReferenceName(value);
            setSelectedPoint((current) => ({ ...current, name: value.trim() || "Punto seleccionado en el mapa" }));
          }}
          placeholder={isOrigin ? "Ejemplo: Av. Teodoro Valcarcel, puerta principal" : "Ejemplo: Mall Aventura, entrada principal"}
        />

        <View style={styles.coordsBox}>
          <Text style={styles.coordsLabel}>Ubicacion del marcador</Text>
          <Text style={styles.coordsText}>Lat. {selectedPoint.latitude.toFixed(5)} / Lng. {selectedPoint.longitude.toFixed(5)}</Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
          <Text style={styles.primaryButtonText}>Confirmar {isOrigin ? "origen" : "destino"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 70, backgroundColor: colors.background },
  compactContainer: { padding: 18, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: "900", color: colors.text, marginTop: 18, marginBottom: 8 },
  compactTitle: { fontSize: 24, lineHeight: 30, marginTop: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, lineHeight: 23, marginBottom: 18 },
  compactSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 12 },
  mapCard: { height: 300, borderRadius: 20, overflow: "hidden", backgroundColor: colors.surface, marginBottom: 18 },
  compactMapCard: { height: 240, marginBottom: 12 },
  map: { flex: 1 },
  mapImage: { borderRadius: 20 },
  marker: { position: "absolute", width: 48, height: 48, marginLeft: -24, marginTop: -24, borderRadius: 999, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  originMarker: { backgroundColor: colors.primary },
  destinationMarker: { backgroundColor: colors.secondary },
  markerText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
  mapOverlay: { position: "absolute", left: 14, right: 14, bottom: 14, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 20, padding: 14 },
  mapOverlayTitle: { color: colors.primaryDark, fontWeight: "900", marginBottom: 4 },
  mapOverlayText: { color: colors.text, fontWeight: "800" },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 18 },
  compactCard: { padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, marginBottom: 10 },
  helperText: { color: colors.textMuted, lineHeight: 20, marginBottom: 12 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { backgroundColor: colors.surfaceSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: colors.border },
  quickChipActive: { backgroundColor: colors.ink, borderColor: colors.primary },
  quickText: { color: colors.primaryDark, fontWeight: "800", fontSize: 12 },
  quickTextActive: { color: "#FFFFFF" },
  input: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 14, fontSize: 16, marginBottom: 14, color: colors.text },
  coordsBox: { backgroundColor: colors.surfaceSoft, borderRadius: 20, padding: 12, marginBottom: 14 },
  coordsLabel: { color: colors.textMuted, fontWeight: "800", marginBottom: 3 },
  coordsText: { color: colors.text, fontWeight: "700" },
  primaryButton: { backgroundColor: colors.ink, padding: 16, borderRadius: 20, alignItems: "center" },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "900" },
  secondaryButton: { backgroundColor: "#E2E8F0", padding: 16, borderRadius: 20, alignItems: "center", marginTop: 10 },
  secondaryButtonText: { color: colors.text, fontSize: 16, fontWeight: "900" },
});
