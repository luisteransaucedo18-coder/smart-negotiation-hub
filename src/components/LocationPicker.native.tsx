import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import AppButton from "./AppButton";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";
import { getCurrentRoutePoint, reverseGeocodePoint } from "../services/locationService";

type Props = { target: LocationTarget; initialPoint: RoutePoint; onSelect: (point: RoutePoint) => void; onCancel: () => void };

export default function LocationPicker({ target, initialPoint, onSelect, onCancel }: Props) {
  const mapRef = useRef<MapView | null>(null);
  const [point, setPoint] = useState<RoutePoint>(initialPoint);
  const [reference, setReference] = useState(initialPoint.name);
  const [locating, setLocating] = useState(target === "origin");
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const title = target === "origin" ? "Elegir origen" : "Elegir destino";
  const markerTitle = target === "origin" ? "Origen" : "Destino";

  const region = useMemo<Region>(() => ({
    latitude: point.latitude,
    longitude: point.longitude,
    latitudeDelta: 0.025,
    longitudeDelta: 0.025,
  }), [point.latitude, point.longitude]);

  useEffect(() => {
    let mounted = true;
    async function loadCurrentLocation() {
      if (target !== "origin") return;
      setLocating(true);
      const currentPoint = await getCurrentRoutePoint();
      if (!mounted) return;
      if (currentPoint) {
        setPoint(currentPoint);
        setReference(currentPoint.name);
        mapRef.current?.animateToRegion({ latitude: currentPoint.latitude, longitude: currentPoint.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }, 350);
      }
      setLocating(false);
    }
    loadCurrentLocation();
    return () => { mounted = false; };
  }, [target]);

  async function movePoint(latitude: number, longitude: number, newName?: string) {
    const optimisticName = newName ?? `Lat. ${latitude.toFixed(5)}, Lng. ${longitude.toFixed(5)}`;
    setPoint({ latitude, longitude, name: optimisticName });
    setReference(optimisticName);
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }, 250);

    if (!newName) {
      setResolvingAddress(true);
      const address = await reverseGeocodePoint(latitude, longitude);
      setPoint({ latitude, longitude, name: address });
      setReference(address);
      setResolvingAddress(false);
    }
  }

  function save() {
    const cleanReference = reference.trim();
    if (cleanReference.length < 3) {
      Alert.alert("Referencia incompleta", "Escribe una calle, avenida o lugar de referencia de al menos 3 caracteres.");
      return;
    }
    onSelect({ latitude: point.latitude, longitude: point.longitude, name: cleanReference });
  }

  return (
    <KeyboardAvoidingView style={styles.full} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 72 : 0}>
      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onPress={(event) => {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            movePoint(latitude, longitude);
          }}
        >
          <Marker
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={markerTitle}
            description={reference.trim() || "Escribe una referencia"}
            draggable
            onDragEnd={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              movePoint(latitude, longitude);
            }}
          />
        </MapView>
        <View style={styles.mapHelpBox}>
          <Text style={styles.mapHelpTitle}>{locating ? "Obteniendo ubicacion..." : "Hotspot del mapa"}</Text>
          <Text style={styles.mapHelpText}>Toca o arrastra el marcador para ubicar exactamente el {target === "origin" ? "origen" : "destino"}.</Text>
        </View>
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>El punto del mapa actualiza coordenadas y direccion automaticamente.</Text>

        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>{target === "origin" ? "Origen seleccionado" : "Destino seleccionado"}</Text>
          <Text style={styles.selectedName}>{reference.trim() || "Referencia pendiente"}</Text>
          <Text style={styles.selectedHint}>{resolvingAddress ? "Actualizando direccion..." : `${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`}</Text>
        </View>

        <Text style={sharedStyles.label}>Direccion o referencia visible</Text>
        <TextInput
          style={sharedStyles.input}
          value={reference}
          onChangeText={setReference}
          placeholder={target === "origin" ? "Ejemplo: Av. Teodoro Valcarcel, puerta principal" : "Ejemplo: Mall Aventura, entrada principal"}
          returnKeyType="done"
        />
        {reference.trim().length < 3 ? <Text style={sharedStyles.fieldError}>Escribe una referencia de al menos 3 caracteres.</Text> : <Text style={sharedStyles.fieldOk}>Referencia lista para confirmar.</Text>}

        <View style={styles.quickHeader}>
          <Text style={styles.quickTitle}>Puntos rapidos</Text>
          {locating && <ActivityIndicator size="small" color={colors.primary} />}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={styles.quickRow}>
          {TRUJILLO_POINTS.map((item) => (
            <TouchableOpacity key={item.name} style={styles.quick} onPress={() => movePoint(item.latitude, item.longitude, item.name)}>
              <Text style={styles.quickText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.buttonRow}>
          <AppButton title={target === "origin" ? "Confirmar origen" : "Confirmar destino"} onPress={save} />
          <AppButton title="Cancelar" onPress={onCancel} variant="ghost" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: colors.background },
  mapWrap: { height: 300, width: "100%", backgroundColor: colors.primarySoft },
  map: { flex: 1 },
  mapHelpBox: { position: "absolute", top: 14, left: 14, right: 14, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 20, padding: 12 },
  mapHelpTitle: { color: colors.text, fontWeight: "900", marginBottom: 2 },
  mapHelpText: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  panel: { flex: 1, marginTop: -18, backgroundColor: colors.background, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  panelContent: { padding: 20, paddingBottom: 130 },
  title: { fontSize: 26, fontWeight: "900", color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 21, marginBottom: 14 },
  selectedBox: { backgroundColor: colors.surface, borderRadius: 20, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  selectedLabel: { color: colors.textMuted, fontWeight: "800", marginBottom: 4 },
  selectedName: { color: colors.text, fontSize: 17, fontWeight: "900" },
  selectedHint: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  quickHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  quickTitle: { color: colors.text, fontWeight: "900" },
  quickRow: { marginBottom: 12 },
  quick: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 20, marginRight: 8 },
  quickText: { color: colors.primaryDark, fontWeight: "900" },
  buttonRow: { paddingTop: 4 },
});
