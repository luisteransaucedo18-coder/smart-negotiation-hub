import React, { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import type { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";

type Props = {
  target: LocationTarget;
  initialPoint: RoutePoint;
  onCancel: () => void;
  onSelect: (point: RoutePoint) => void;
};

export default function LocationPicker({
  target,
  initialPoint,
  onCancel,
  onSelect,
}: Props) {
  const [selectedPoint, setSelectedPoint] = useState<RoutePoint>(initialPoint);
  const [referenceName, setReferenceName] = useState(initialPoint.name);

  const isOrigin = target === "origin";

  function handleSelectPoint(point: RoutePoint) {
    setSelectedPoint(point);
    setReferenceName(point.name);
  }

  function handleConfirm() {
    const cleanName = referenceName.trim();

    if (!cleanName) {
      Alert.alert("Falta referencia", "Escribe una referencia para la ubicación.");
      return;
    }

    onSelect({
      ...selectedPoint,
      name: cleanName,
    });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isOrigin ? "Elegir origen" : "Elegir destino"}
      </Text>

      <Text style={styles.subtitle}>
        {isOrigin
          ? "Selecciona el punto donde iniciarás el viaje."
          : "Selecciona el punto al que quieres llegar."}
      </Text>

      <View style={styles.mapCard}>
        <View style={styles.mapArea}>
          <View style={styles.mapRoadOne} />
          <View style={styles.mapRoadTwo} />
          <View style={styles.mapRoadThree} />

          <View style={[styles.pin, isOrigin ? styles.originPin : styles.destinationPin]}>
            <Text style={styles.pinText}>{isOrigin ? "A" : "B"}</Text>
          </View>

          <Text style={styles.mapTitle}>
            {Platform.OS === "web" ? "Vista de mapa" : "Selector de ubicación"}
          </Text>

          <Text style={styles.mapSubtitle}>
            Elige un punto rápido o escribe una referencia.
          </Text>
        </View>

        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>
            {isOrigin ? "Origen seleccionado" : "Destino seleccionado"}
          </Text>
          <Text style={styles.selectedName}>{selectedPoint.name}</Text>
          <Text style={styles.selectedCoords}>
            {selectedPoint.latitude.toFixed(5)}, {selectedPoint.longitude.toFixed(5)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Puntos rápidos en Trujillo</Text>

        <View style={styles.quickGrid}>
          {TRUJILLO_POINTS.map((point) => {
            const active =
              selectedPoint.latitude === point.latitude &&
              selectedPoint.longitude === point.longitude;

            return (
              <TouchableOpacity
                key={point.name}
                style={[styles.quickChip, active && styles.quickChipActive]}
                onPress={() => handleSelectPoint(point)}
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
        <Text style={styles.sectionTitle}>Referencia visible para el viaje</Text>

        <Text style={styles.label}>
          {isOrigin ? "Nombre del origen" : "Nombre del destino"}
        </Text>

        <TextInput
          style={styles.input}
          value={referenceName}
          onChangeText={setReferenceName}
          placeholder={isOrigin ? "Ejemplo: Universidad UTP" : "Ejemplo: Mall Aventura"}
        />

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
    padding: 16,
    paddingBottom: 50,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 28,
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
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colors.surface,
    marginBottom: 18,
  },
  mapArea: {
    height: 240,
    backgroundColor: "#DDF4FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  mapRoadOne: {
    position: "absolute",
    width: "130%",
    height: 5,
    backgroundColor: "rgba(20,99,255,0.20)",
    transform: [{ rotate: "20deg" }],
  },
  mapRoadTwo: {
    position: "absolute",
    width: "120%",
    height: 5,
    backgroundColor: "rgba(16,185,129,0.18)",
    transform: [{ rotate: "-25deg" }],
  },
  mapRoadThree: {
    position: "absolute",
    width: "105%",
    height: 4,
    backgroundColor: "rgba(15,23,42,0.12)",
    transform: [{ rotate: "90deg" }],
  },
  pin: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  originPin: {
    backgroundColor: colors.primary,
  },
  destinationPin: {
    backgroundColor: colors.secondary,
  },
  pinText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "900",
  },
  mapTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.primaryDark,
    marginBottom: 6,
  },
  mapSubtitle: {
    color: colors.textMuted,
    textAlign: "center",
    paddingHorizontal: 24,
  },
  selectedBox: {
    padding: 16,
    backgroundColor: colors.surface,
  },
  selectedLabel: {
    color: colors.textMuted,
    fontWeight: "800",
    marginBottom: 4,
  },
  selectedName: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
  },
  selectedCoords: {
    color: colors.textMuted,
    marginTop: 4,
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
  label: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "800",
    marginBottom: 6,
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
  primaryButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
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
