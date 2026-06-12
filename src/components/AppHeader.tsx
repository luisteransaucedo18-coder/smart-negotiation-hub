import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { UserProfile } from "../types";
import { colors } from "../theme/colors";
import SmartHubLogo from "./SmartHubLogo";

type Props = { profile: UserProfile | null; onLogout: () => void };

export default function AppHeader({ profile, onLogout }: Props) {
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <SmartHubLogo showText={false} size={42} />
        <View style={{ flex: 1 }}>
          <Text style={styles.logo}>SmartHub</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {profile ? `${profile.name} - ${profile.role === "passenger" ? "Pasajero" : "Conductor"}` : "Movilidad con confianza"}
          </Text>
        </View>
      </View>
      {profile && (
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 8, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, flexWrap: "wrap" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 220 },
  logo: { fontSize: 20, fontWeight: "900", color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: 2, fontSize: 12 },
  logoutButton: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  logoutText: { color: "#334155", fontWeight: "900" },
});
