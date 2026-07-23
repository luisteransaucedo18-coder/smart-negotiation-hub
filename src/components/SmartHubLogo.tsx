import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

const smartHubLogo = require("../../assets/images/smarthub-logo.png");

export default function SmartHubLogo({ showText = true, size = 58 }: { showText?: boolean; size?: number }) {
  return (
    <View style={styles.wrapper}>
      <Image source={smartHubLogo} style={[styles.logoImage, { width: size, height: size, borderRadius: size / 2 }]} resizeMode="cover" />
      {showText && (
        <View>
          <Text style={styles.name}>SmartHub</Text>
          <Text style={styles.tagline}>viajes negociados</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", justifyContent: "center", gap: 8 },
  logoImage: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  name: { fontSize: 28, fontWeight: "900", color: colors.text, textAlign: "center" },
  tagline: { fontSize: 13, fontWeight: "700", color: colors.textMuted, textAlign: "center", letterSpacing: 0 },
});
