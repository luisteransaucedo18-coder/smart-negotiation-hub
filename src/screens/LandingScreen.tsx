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
      <View style={styles.storyBox}>
        <Text style={styles.storyKicker}>Caso demo</Text>
        <Text style={styles.storyTitle}>La ruta inteligente de Luis</Text>
        <Text style={styles.storyText}>Salida nocturna, precio protegido y conductor Marco verificado.</Text>
      </View>
      <View style={styles.promiseBox}>
        <Text style={styles.promise}>Tu camino, tus reglas, cero sorpresas.</Text>
        <Text style={styles.value}>Negocia tarifa, verifica confianza y viaja con monitoreo activo en Trujillo.</Text>
      </View>
      <AppButton title="Ingresar" onPress={onLogin} />
      <AppButton title="Crear cuenta" onPress={onRegister} variant="secondary" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoBox: { alignItems: "center", marginTop: 18, marginBottom: 8 },
  promiseBox: { backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 6 },
  promise: { color: colors.text, lineHeight: 23, marginBottom: 4, fontSize: 17, fontWeight: "900" },
  value: { color: colors.textMuted, lineHeight: 21 },
  storyBox: { backgroundColor: colors.ink, borderRadius: 12, padding: 16, marginBottom: 12 },
  storyKicker: { color: colors.amber, fontWeight: "900", marginBottom: 4, textTransform: "uppercase", fontSize: 12 },
  storyTitle: { color: "#FFFFFF", fontWeight: "900", fontSize: 20, marginBottom: 5 },
  storyText: { color: "#CBD5E1", lineHeight: 21, fontWeight: "700" },
});
