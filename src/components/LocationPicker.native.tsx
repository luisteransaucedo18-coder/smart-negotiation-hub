import React, { useMemo, useRef, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import AppButton from "./AppButton";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";

type Props = { target: LocationTarget; initialPoint: RoutePoint; onSelect: (point: RoutePoint) => void; onCancel: () => void };

export default function LocationPicker({ target, initialPoint, onSelect, onCancel }: Props) {
  const mapRef = useRef<MapView | null>(null);
  const [point, setPoint] = useState<RoutePoint>(initialPoint);
  const [reference, setReference] = useState(initialPoint.name);
  const title = target === "origin" ? "Elegir origen" : "Elegir destino";
  const markerTitle = target === "origin" ? "Origen" : "Destino";
  const region = useMemo<Region>(() => ({ latitude: point.latitude, longitude: point.longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }), [point]);

  function movePoint(latitude: number, longitude: number, newName?: string) {
    const nextReference = newName ?? reference;
    const nextPoint = { latitude, longitude, name: nextReference.trim() || markerTitle };
    setPoint(nextPoint);
    if (newName) setReference(newName);
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.025, longitudeDelta: 0.025 }, 250);
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
          initialRegion={region}
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
          <Text style={styles.mapHelpTitle}>Toca el mapa</Text>
          <Text style={styles.mapHelpText}>El marcador se moverá al punto seleccionado.</Text>
        </View>
      </View>

      <ScrollView style={styles.panel} contentContainerStyle={styles.panelContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Toca el mapa o arrastra el marcador. Luego escribe la dirección visible para el conductor.</Text>

        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>{target === "origin" ? "Origen seleccionado" : "Destino seleccionado"}</Text>
          <Text style={styles.selectedName}>{reference.trim() || "Referencia pendiente"}</Text>
          <Text style={styles.selectedHint}>Punto ubicado en el mapa</Text>
        </View>

        <Text style={sharedStyles.label}>Dirección o referencia visible</Text>
        <TextInput
          style={sharedStyles.input}
          value={reference}
          onChangeText={setReference}
          placeholder={target === "origin" ? "Ejemplo: Av. Teodoro Valcárcel, puerta principal" : "Ejemplo: Mall Aventura, entrada principal"}
          returnKeyType="done"
        />
        {reference.trim().length < 3 ? <Text style={sharedStyles.fieldError}>Escribe una referencia de al menos 3 caracteres.</Text> : <Text style={sharedStyles.fieldOk}>Referencia lista para confirmar.</Text>}

        <Text style={styles.quickTitle}>Puntos rápidos</Text>
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
  mapWrap: { height: 285, width: "100%", backgroundColor: colors.primarySoft },
  map: { flex: 1 },
  mapHelpBox: { position: "absolute", top: 14, left: 14, right: 14, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 18, padding: 12 },
  mapHelpTitle: { color: colors.text, fontWeight: "900", marginBottom: 2 },
  mapHelpText: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  panel: { flex: 1, marginTop: -18, backgroundColor: colors.background, borderTopLeftRadius: 26, borderTopRightRadius: 26 },
  panelContent: { padding: 20, paddingBottom: 130 },
  title: { fontSize: 26, fontWeight: "900", color: colors.text, marginBottom: 6 },
  subtitle: { color: colors.textMuted, lineHeight: 21, marginBottom: 14 },
  selectedBox: { backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  selectedLabel: { color: colors.textMuted, fontWeight: "800", marginBottom: 4 },
  selectedName: { color: colors.text, fontSize: 17, fontWeight: "900" },
  selectedHint: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  quickTitle: { color: colors.text, fontWeight: "900", marginBottom: 8 },
  quickRow: { marginBottom: 12 },
  quick: { backgroundColor: colors.primarySoft, paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, marginRight: 8 },
  quickText: { color: colors.primaryDark, fontWeight: "900" },
  buttonRow: { paddingTop: 4 },
});
