import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function SmartHubLogo({ showText = true, size = 58 }: { showText?: boolean; size?: number }) {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.pin, { width: size, height: size, borderRadius: size / 2 }]}> 
        <View style={[styles.route, { width: size * 0.65 }]} />
        <Text style={[styles.car, { fontSize: size * 0.34 }]}>🚘</Text>
        <View style={[styles.shield, { width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17 }]} />
      </View>
      {showText && (
        <View>
          <Text style={styles.name}>SmartHub</Text>
          <Text style={styles.tagline}>negocia seguro</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", gap: 8 },
  pin: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#FFFFFF",
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 5,
  },
  route: { position: "absolute", height: 10, backgroundColor: colors.secondary, bottom: 8, right: -8, transform: [{ rotate: "-20deg" }], borderRadius: 999 },
  shield: { position: "absolute", right: 7, top: 7, backgroundColor: colors.secondary, opacity: 0.95 },
  car: { zIndex: 2 },
  name: { fontSize: 28, fontWeight: "900", color: colors.text, textAlign: "center" },
  tagline: { fontSize: 13, fontWeight: "800", color: colors.textMuted, textAlign: "center", letterSpacing: 0.8 },
});
