import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function HeroBanner() {
  return (
    <View style={styles.hero}>
      <View style={styles.skyGlow} />
      <View style={styles.roadOne} />
      <View style={styles.roadTwo} />
      <View style={styles.roadThree} />

      <View style={styles.cityRow}>
        <View style={[styles.building, styles.buildingSmall]} />
        <View style={[styles.building, styles.buildingTall]} />
        <View style={[styles.building, styles.buildingMedium]} />
        <View style={[styles.building, styles.buildingSmall]} />
      </View>

      <View style={styles.routeCard}>
        <View style={styles.routePinA}><Text style={styles.pinText}>A</Text></View>
        <View style={styles.routeLine} />
        <View style={styles.carBubble}><Text style={styles.carIcon}>🚘</Text></View>
        <View style={styles.routeLine} />
        <View style={styles.routePinB}><Text style={styles.pinText}>B</Text></View>
      </View>

      <Text style={styles.kicker}>Filtro de confianza</Text>
      <Text style={styles.title}>Negociación segura de tarifas</Text>
      <Text style={styles.text}>Ruta segura · Tarifa pactada · Conductor verificado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { minHeight: 286, marginBottom: 18, borderRadius: 32, overflow: "hidden", backgroundColor: "#DDF4FF", alignItems: "center", justifyContent: "center", padding: 22, position: "relative" },
  skyGlow: { position: "absolute", width: 220, height: 220, borderRadius: 110, backgroundColor: "rgba(255,255,255,0.55)", top: -70, right: -50 },
  roadOne: { position: "absolute", width: "135%", height: 8, backgroundColor: "rgba(20,99,255,0.18)", transform: [{ rotate: "24deg" }] },
  roadTwo: { position: "absolute", width: "130%", height: 8, backgroundColor: "rgba(16,185,129,0.20)", transform: [{ rotate: "-22deg" }] },
  roadThree: { position: "absolute", width: "90%", height: 5, backgroundColor: "rgba(6,182,212,0.22)", transform: [{ rotate: "88deg" }] },
  cityRow: { position: "absolute", left: 20, right: 20, bottom: 18, flexDirection: "row", justifyContent: "space-around", opacity: 0.22 },
  building: { width: 34, backgroundColor: colors.primaryDark, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  buildingSmall: { height: 48 },
  buildingMedium: { height: 66 },
  buildingTall: { height: 86 },
  routeCard: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.88)", borderRadius: 28, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 16, shadowColor: colors.primaryDark, shadowOpacity: 0.16, shadowRadius: 12, elevation: 4 },
  routePinA: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  routePinB: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" },
  pinText: { color: "#FFFFFF", fontWeight: "900" },
  routeLine: { width: 38, height: 4, borderRadius: 999, backgroundColor: colors.border, marginHorizontal: 6 },
  carBubble: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.primaryDark, alignItems: "center", justifyContent: "center" },
  carIcon: { fontSize: 32 },
  kicker: { color: colors.secondaryDark, fontWeight: "900", marginBottom: 6 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", textAlign: "center", lineHeight: 32 },
  text: { color: colors.textMuted, marginTop: 8, lineHeight: 20, textAlign: "center", fontWeight: "800" },
});
