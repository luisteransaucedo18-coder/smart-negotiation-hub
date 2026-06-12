import React, { useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import { colors } from "../theme/colors";
import type { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";

type Props = {
  target: LocationTarget;
  initialPoint: RoutePoint;
  onCancel: () => void;
  onSelect: (point: RoutePoint) => void;
};

export default function MapLocationPickerScreen({
  target,
  initialPoint,
  onCancel,
  onSelect,
}: Props) {
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint>(initialPoint);
  const [referenceName, setReferenceName] = useState(initialPoint.name || "");

  const isOrigin = target === "origin";

  const region = useMemo(
    () => ({
      latitude: selectedPoint.latitude,
      longitude: selectedPoint.longitude,
      latitudeDelta: 0.025,
      longitudeDelta: 0.025,
    }),
    [selectedPoint.latitude, selectedPoint.longitude]
  );

  function updatePoint(latitude: number, longitude: number) {
    const cleanReference = referenceName.trim();

    setSelectedPoint({
      name: cleanReference || "Punto seleccionado en el mapa",
      latitude,
      longitude,
    });
  }

  function selectQuickPoint(point: RoutePoint) {
    setSelectedPoint(point);
    setReferenceName(point.name);
  }

  function handleConfirm() {
    const cleanReference = referenceName.trim();

    if (!cleanReference) {
      Alert.alert(
        "Falta referencia",
        "Escribe una calle, avenida o lugar de referencia. Ejemplo: Av. Teodoro Valcárcel, puerta principal."
      );
      return;
    }

    onSelect({
      name: cleanReference,
      latitude: selectedPoint.latitude,
      longitude: selectedPoint.longitude,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{isOrigin ? "Elegir origen" : "Elegir destino"}</Text>
      <Text style={styles.subtitle}>
        Toca cualquier punto del mapa para mover el marcador. Luego escribe una referencia visible para el viaje.
      </Text>

      <View style={styles.mapCard}>
        <MapView
          style={styles.map}
          region={region}
          onPress={(event) => {
            const { latitude, longitude } = event.nativeEvent.coordinate;
            updatePoint(latitude, longitude);
          }}
        >
          <Marker
            coordinate={{
              latitude: selectedPoint.latitude,
              longitude: selectedPoint.longitude,
            }}
            draggable
            title={isOrigin ? "Origen" : "Destino"}
            description={referenceName || "Punto seleccionado"}
            pinColor={isOrigin ? colors.primary : colors.secondary}
            onDragEnd={(event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              updatePoint(latitude, longitude);
            }}
          />
        </MapView>

        <View style={styles.mapOverlay}>
          <Text style={styles.mapOverlayTitle}>{isOrigin ? "Origen" : "Destino"}</Text>
          <Text style={styles.mapOverlayText}>
            {referenceName.trim() || selectedPoint.name || "Toca el mapa y escribe una referencia"}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Puntos rápidos en Trujillo</Text>
        <View style={styles.quickGrid}>
          {TRUJILLO_POINTS.map((point) => {
            const active =
              point.latitude === selectedPoint.latitude &&
              point.longitude === selectedPoint.longitude;

            return (
              <TouchableOpacity
                key={point.name}
                style={[styles.quickChip, active && styles.quickChipActive]}
                onPress={() => selectQuickPoint(point)}
              >
                <Text style={[styles.quickText, active && styles.quickTextActive]}>
                  {point.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dirección o referencia visible</Text>
        <Text style={styles.helperText}>
          Esto verá la otra persona. Usa una referencia clara, no solo coordenadas.
        </Text>

        <TextInput
          style={styles.input}
          value={referenceName}
          onChangeText={(value) => {
            setReferenceName(value);
            setSelectedPoint((current) => ({
              ...current,
              name: value.trim() || "Punto seleccionado en el mapa",
            }));
          }}
          placeholder={
            isOrigin
              ? "Ejemplo: Av. Teodoro Valcárcel, puerta principal"
              : "Ejemplo: Mall Aventura, entrada principal"
          }
        />

        <View style={styles.coordsBox}>
          <Text style={styles.coordsLabel}>Ubicación del marcador</Text>
          <Text style={styles.coordsText}>
            Lat. {selectedPoint.latitude.toFixed(5)} · Lng. {selectedPoint.longitude.toFixed(5)}
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
          <Text style={styles.primaryButtonText}>
            Confirmar {isOrigin ? "origen" : "destino"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingBottom: 70,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 30,
    fontWeight: "900",
    color: colors.text,
    marginTop: 18,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    lineHeight: 23,
    marginBottom: 18,
  },
  mapCard: {
    height: 330,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginBottom: 18,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 18,
    padding: 14,
  },
  mapOverlayTitle: {
    color: colors.primaryDark,
    fontWeight: "900",
    marginBottom: 4,
  },
  mapOverlayText: {
    color: colors.text,
    fontWeight: "800",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 10,
  },
  helperText: {
    color: colors.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickChip: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
  },
  quickChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickText: {
    color: colors.primaryDark,
    fontWeight: "800",
    fontSize: 12,
  },
  quickTextActive: {
    color: "#FFFFFF",
  },
  input: {
    backgroundColor: colors.surfaceSoft,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
    color: colors.text,
  },
  coordsBox: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  coordsLabel: {
    color: colors.textMuted,
    fontWeight: "800",
    marginBottom: 3,
  },
  coordsText: {
    color: colors.text,
    fontWeight: "700",
  },
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: "#E2E8F0",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
});
