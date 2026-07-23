import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, GestureResponderEvent, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppButton from "./AppButton";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";
import { getCurrentRoutePoint, reverseGeocodePoint } from "../services/locationService";

type Props = { target: LocationTarget; initialPoint: RoutePoint; onSelect: (point: RoutePoint) => void; onCancel: () => void };

const mapReference = require("../../assets/images/map-reference.png");

export default function LocationPicker({ target, initialPoint, onSelect, onCancel }: Props) {
  const [point, setPoint] = useState<RoutePoint>(initialPoint);
  const [reference, setReference] = useState(initialPoint.name);
  const [hotspot, setHotspot] = useState({ x: target === "origin" ? 24 : 72, y: target === "origin" ? 58 : 34 });
  const [locating, setLocating] = useState(target === "origin");
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const isOrigin = target === "origin";

  useEffect(() => {
    let mounted = true;
    async function loadCurrentLocation() {
      if (!isOrigin) return;
      setLocating(true);
      const currentPoint = await getCurrentRoutePoint();
      if (!mounted) return;
      if (currentPoint) {
        setPoint(currentPoint);
        setReference(currentPoint.name);
        setHotspot({ x: 24, y: 58 });
      }
      setLocating(false);
    }
    loadCurrentLocation();
    return () => { mounted = false; };
  }, [isOrigin]);

  async function movePoint(latitude: number, longitude: number, name?: string) {
    const optimisticName = name ?? `Lat. ${latitude.toFixed(5)}, Lng. ${longitude.toFixed(5)}`;
    setPoint({ latitude, longitude, name: optimisticName });
    setReference(optimisticName);
    if (!name) {
      setResolvingAddress(true);
      const address = await reverseGeocodePoint(latitude, longitude);
      setPoint({ latitude, longitude, name: address });
      setReference(address);
      setResolvingAddress(false);
    }
  }

  function handleMapPress(event: GestureResponderEvent) {
    const { locationX, locationY } = event.nativeEvent;
    const width = 342;
    const height = 230;
    const x = Math.max(8, Math.min(92, (locationX / width) * 100));
    const y = Math.max(8, Math.min(92, (locationY / height) * 100));
    setHotspot({ x, y });
    const latitude = point.latitude + ((50 - y) / 50) * 0.01;
    const longitude = point.longitude + ((x - 50) / 50) * 0.01;
    movePoint(latitude, longitude);
  }

  function save() {
    const cleanReference = reference.trim();
    if (cleanReference.length < 3) {
      Alert.alert("Referencia incompleta", "Escribe una calle, avenida o lugar de referencia de al menos 3 caracteres.");
      return;
    }
    onSelect({ ...point, name: cleanReference });
  }

  function selectPoint(next: RoutePoint) {
    setHotspot({ x: 50, y: 50 });
    movePoint(next.latitude, next.longitude, next.name);
  }

  return (
    <KeyboardAvoidingView style={styles.full} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 72 : 0}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{isOrigin ? "Elegir origen" : "Elegir destino"}</Text>
        <Text style={styles.subtitle}>Toca el mapa para mover el hotspot y actualizar la direccion.</Text>

        <View style={styles.mapCard}>
          <ImageBackground source={mapReference} style={styles.mapArea} imageStyle={styles.mapImage}>
            <TouchableOpacity activeOpacity={0.9} style={StyleSheet.absoluteFill} onPress={handleMapPress}>
              <View style={[styles.pin, isOrigin ? styles.originPin : styles.destinationPin, { left: `${hotspot.x}%`, top: `${hotspot.y}%` }]}>
                <Text style={styles.pinText}>{isOrigin ? "A" : "B"}</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.mapTitle}>Hotspot de ubicacion</Text>
            <Text style={styles.mapSubtitle}>{locating ? "Obteniendo tu ubicacion actual..." : "Toca para senalar el punto exacto."}</Text>
          </ImageBackground>
          <View style={styles.selectedBox}>
            <Text style={styles.selectedLabel}>{isOrigin ? "Origen seleccionado" : "Destino seleccionado"}</Text>
            <Text style={styles.selectedName}>{reference.trim() || point.name}</Text>
            <Text style={styles.selectedHint}>{resolvingAddress ? "Actualizando direccion..." : `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.quickHeader}>
            <Text style={styles.sectionTitle}>Puntos rapidos en Trujillo</Text>
            {locating && <ActivityIndicator size="small" color={colors.primary} />}
          </View>
          <View style={styles.quickGrid}>
            {TRUJILLO_POINTS.map((item) => {
              const active = point.latitude === item.latitude && point.longitude === item.longitude;
              return (
                <TouchableOpacity key={item.name} style={[styles.quickChip, active && styles.quickChipActive]} onPress={() => selectPoint(item)}>
                  <Text style={[styles.quickText, active && styles.quickTextActive]}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={sharedStyles.label}>Direccion o referencia visible</Text>
          <TextInput
            style={sharedStyles.input}
            value={reference}
            onChangeText={setReference}
            placeholder={isOrigin ? "Ejemplo: Av. Teodoro Valcarcel" : "Ejemplo: Mall Aventura"}
            returnKeyType="done"
          />
          {reference.trim().length < 3 ? <Text style={sharedStyles.fieldError}>Escribe una referencia de al menos 3 caracteres.</Text> : <Text style={sharedStyles.fieldOk}>Referencia lista para confirmar.</Text>}
          <AppButton title={isOrigin ? "Confirmar origen" : "Confirmar destino"} onPress={save} />
          <AppButton title="Cancelar" onPress={onCancel} variant="ghost" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: colors.background },
  container: { padding: 18, paddingBottom: 130, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "900", color: colors.text, marginTop: 18, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, lineHeight: 23, marginBottom: 18 },
  mapCard: { borderRadius: 20, overflow: "hidden", backgroundColor: colors.surface, marginBottom: 18 },
  mapArea: { height: 230, backgroundColor: "#DDF4FF", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" },
  mapImage: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  pin: { position: "absolute", width: 54, height: 54, marginLeft: -27, marginTop: -27, borderRadius: 999, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF" },
  originPin: { backgroundColor: colors.primary },
  destinationPin: { backgroundColor: colors.secondary },
  pinText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  mapTitle: { fontSize: 22, fontWeight: "900", color: colors.primaryDark, marginBottom: 6, backgroundColor: "rgba(255,255,255,0.82)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, overflow: "hidden" },
  mapSubtitle: { color: colors.textMuted, textAlign: "center", paddingHorizontal: 12, paddingVertical: 4, backgroundColor: "rgba(255,255,255,0.82)", borderRadius: 20, overflow: "hidden" },
  selectedBox: { padding: 16, backgroundColor: colors.surface },
  selectedLabel: { color: colors.textMuted, fontWeight: "800", marginBottom: 4 },
  selectedName: { color: colors.text, fontSize: 18, fontWeight: "900" },
  selectedHint: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  card: { backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 18 },
  quickHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { backgroundColor: colors.surfaceSoft, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: colors.border },
  quickChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  quickText: { color: colors.primaryDark, fontWeight: "800", fontSize: 12 },
  quickTextActive: { color: "#FFFFFF" },
});
