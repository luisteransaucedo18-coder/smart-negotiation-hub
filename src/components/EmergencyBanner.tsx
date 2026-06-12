import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Role, Trip } from "../types";
import { colors } from "../theme/colors";

export default function EmergencyBanner({ trip, role }: { trip: Trip; role: Role }) {
  if (trip.emergencyStatus !== "active") return null;
  const own = trip.lastEmergencyByRole === role;
  return (
    <View style={styles.box}>
      <Text style={styles.title}>⚠️ Alerta activa en este viaje</Text>
      <Text style={styles.text}>
        {own
          ? "Tu alerta fue registrada y se prepararon los datos críticos para tu contacto de emergencia."
          : `${trip.lastEmergencyByName || "La otra parte"} activó una alerta. Mantén la calma, verifica la situación y evita continuar el viaje sin confirmación.`}
      </Text>
      <Text style={styles.step}>• La tarifa y la ruta quedan visibles.</Text>
      <Text style={styles.step}>• Los controles del viaje se bloquean hasta resolver la alerta.</Text>
      <Text style={styles.step}>• Revisa placa, conductor/pasajero y ubicación antes de continuar.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.dangerSoft, borderColor: "#FCA5A5", borderWidth: 1, padding: 15, borderRadius: 18, marginBottom: 16 },
  title: { color: "#991B1B", fontSize: 17, fontWeight: "900", marginBottom: 6 },
  text: { color: "#7F1D1D", lineHeight: 20, marginBottom: 6 },
  step: { color: "#991B1B", fontWeight: "700", marginTop: 3 },
});
