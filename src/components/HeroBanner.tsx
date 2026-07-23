import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function HeroBanner() {
  return (
    <View style={styles.hero}>
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
        <View style={styles.routePinA}><Text style={styles.pinText}>UTP</Text></View>
        <View style={styles.routeLine} />
        <View style={styles.carBubble}><Text style={styles.carText}>ID</Text></View>
        <View style={styles.routeLine} />
        <View style={styles.routePinB}><Text style={styles.pinText}>MALL</Text></View>
      </View>

      <Text style={styles.kicker}>Smart-Negotiation Hub</Text>
      <Text style={styles.title}>Negocia precio. Verifica confianza.</Text>
      <Text style={styles.text}>Trujillo urbano - tarifa protegida - conductor validado</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { minHeight: 286, marginBottom: 18, borderRadius: 20, overflow: "hidden", backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", padding: 22, position: "relative", borderWidth: 1, borderColor: "#C8D8FF" },
  roadOne: { position: "absolute", width: "135%", height: 8, backgroundColor: "#C8D8FF", transform: [{ rotate: "24deg" }] },
  roadTwo: { position: "absolute", width: "130%", height: 8, backgroundColor: "#BDEBE5", transform: [{ rotate: "-22deg" }] },
  roadThree: { position: "absolute", width: "90%", height: 5, backgroundColor: "#B9E7FA", transform: [{ rotate: "88deg" }] },
  cityRow: { position: "absolute", left: 20, right: 20, bottom: 18, flexDirection: "row", justifyContent: "space-around", opacity: 0.18 },
  building: { width: 34, backgroundColor: colors.primaryDark, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  buildingSmall: { height: 48 },
  buildingMedium: { height: 66 },
  buildingTall: { height: 86 },
  routeCard: { flexDirection: "row", alignItems: "center", backgroundColor: colors.surface, borderRadius: 20, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  routePinA: { width: 42, height: 34, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  routePinB: { width: 52, height: 34, borderRadius: 20, backgroundColor: colors.secondary, alignItems: "center", justifyContent: "center" },
  pinText: { color: "#FFFFFF", fontWeight: "900", fontSize: 11 },
  routeLine: { width: 34, height: 4, borderRadius: 4, backgroundColor: colors.border, marginHorizontal: 6 },
  carBubble: { width: 62, height: 62, borderRadius: 20, backgroundColor: colors.primaryDark, alignItems: "center", justifyContent: "center" },
  carText: { color: "#FFFFFF", fontSize: 20, fontWeight: "900" },
  kicker: { color: colors.secondaryDark, fontWeight: "900", marginBottom: 6 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", textAlign: "center", lineHeight: 32 },
  text: { color: colors.textMuted, marginTop: 8, lineHeight: 20, textAlign: "center", fontWeight: "800" },
});
