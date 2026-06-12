import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppButton from "./AppButton";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { LocationTarget, RoutePoint } from "../types";
import { TRUJILLO_POINTS } from "../services/distanceService";

type Props = { target: LocationTarget; initialPoint: RoutePoint; onSelect: (point: RoutePoint) => void; onCancel: () => void };

export default function LocationPicker({ target, initialPoint, onSelect, onCancel }: Props) {
  const [point, setPoint] = useState<RoutePoint>(initialPoint);
  const [reference, setReference] = useState(initialPoint.name);
  const isOrigin = target === "origin";

  function save() {
    const cleanReference = reference.trim();
    if (cleanReference.length < 3) {
      Alert.alert("Referencia incompleta", "Escribe una calle, avenida o lugar de referencia de al menos 3 caracteres.");
      return;
    }
    onSelect({ ...point, name: cleanReference });
  }

  function selectPoint(next: RoutePoint) {
    setPoint(next);
    setReference(next.name);
  }

  return (
    <KeyboardAvoidingView style={styles.full} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 72 : 0}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{isOrigin ? "Elegir origen" : "Elegir destino"}</Text>
        <Text style={styles.subtitle}>Selecciona un punto rápido o escribe una referencia visible.</Text>

        <View style={styles.mapCard}>
          <View style={styles.mapArea}>
            <View style={styles.roadOne} />
            <View style={styles.roadTwo} />
            <View style={[styles.pin, isOrigin ? styles.originPin : styles.destinationPin]}><Text style={styles.pinText}>{isOrigin ? "A" : "B"}</Text></View>
            <Text style={styles.mapTitle}>Vista de ubicación</Text>
            <Text style={styles.mapSubtitle}>En celular se muestra el mapa real. En web se usan puntos rápidos.</Text>
          </View>
          <View style={styles.selectedBox}>
            <Text style={styles.selectedLabel}>{isOrigin ? "Origen seleccionado" : "Destino seleccionado"}</Text>
            <Text style={styles.selectedName}>{reference.trim() || point.name}</Text>
            <Text style={styles.selectedHint}>Punto elegido para calcular distancia y precio.</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Puntos rápidos en Trujillo</Text>
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
          <Text style={sharedStyles.label}>Dirección o referencia visible</Text>
          <TextInput
            style={sharedStyles.input}
            value={reference}
            onChangeText={setReference}
            placeholder={isOrigin ? "Ejemplo: Av. Teodoro Valcárcel" : "Ejemplo: Mall Aventura"}
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
  container: { padding: 20, paddingBottom: 130, backgroundColor: colors.background },
  title: { fontSize: 30, fontWeight: "900", color: colors.text, marginTop: 18, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textMuted, lineHeight: 23, marginBottom: 18 },
  mapCard: { borderRadius: 26, overflow: "hidden", backgroundColor: colors.surface, marginBottom: 18 },
  mapArea: { height: 250, backgroundColor: "#DDF4FF", alignItems: "center", justifyContent: "center", position: "relative" },
  roadOne: { position: "absolute", width: "130%", height: 6, backgroundColor: "rgba(20,99,255,0.20)", transform: [{ rotate: "20deg" }] },
  roadTwo: { position: "absolute", width: "120%", height: 6, backgroundColor: "rgba(16,185,129,0.18)", transform: [{ rotate: "-25deg" }] },
  pin: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center", marginBottom: 14 },
  originPin: { backgroundColor: colors.primary },
  destinationPin: { backgroundColor: colors.secondary },
  pinText: { color: "#FFFFFF", fontSize: 24, fontWeight: "900" },
  mapTitle: { fontSize: 22, fontWeight: "900", color: colors.primaryDark, marginBottom: 6 },
  mapSubtitle: { color: colors.textMuted, textAlign: "center", paddingHorizontal: 24 },
  selectedBox: { padding: 16, backgroundColor: colors.surface },
  selectedLabel: { color: colors.textMuted, fontWeight: "800", marginBottom: 4 },
  selectedName: { color: colors.text, fontSize: 18, fontWeight: "900" },
  selectedHint: { color: colors.textMuted, marginTop: 4, fontSize: 13 },
  card: { backgroundColor: colors.surface, borderRadius: 22, padding: 18, marginBottom: 18 },
  sectionTitle: { fontSize: 18, fontWeight: "900", color: colors.text, marginBottom: 12 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: { backgroundColor: colors.surfaceSoft, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1, borderColor: colors.border },
  quickChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  quickText: { color: colors.primaryDark, fontWeight: "800", fontSize: 12 },
  quickTextActive: { color: "#FFFFFF" },
});
