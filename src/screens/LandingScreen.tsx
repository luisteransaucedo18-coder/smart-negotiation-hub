import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import HeroBanner from "../components/HeroBanner";
import SmartHubLogo from "../components/SmartHubLogo";
import { colors } from "../theme/colors";

export default function LandingScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  return (
    <View>
      <View style={styles.logoBox}><SmartHubLogo /></View>
      <HeroBanner />
      <Text style={styles.value}>Transparencia de tarifa, conductor verificado y herramientas de protección para viajes urbanos en Trujillo.</Text>
      <View style={styles.metricsRow}>
        <View style={styles.metric}><Text style={styles.metricNumber}>Precio</Text><Text style={styles.metricText}>rango recomendado</Text></View>
        <View style={styles.metric}><Text style={styles.metricNumber}>100</Text><Text style={styles.metricText}>puntaje confianza</Text></View>
        <View style={styles.metric}><Text style={styles.metricNumber}>SOS</Text><Text style={styles.metricText}>alerta rápida</Text></View>
      </View>
      <AppButton title="Ingresar" onPress={onLogin} />
      <AppButton title="Crear cuenta" onPress={onRegister} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: { alignItems: "center", marginTop: 18, marginBottom: 8 },
  value: { color: colors.textMuted, textAlign: "center", lineHeight: 22, marginBottom: 14 },
  metricsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  metric: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, padding: 12, alignItems: "center" },
  metricNumber: { color: colors.primary, fontWeight: "900" },
  metricText: { color: colors.textMuted, fontSize: 11, textAlign: "center", marginTop: 3 },
});
