import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { UserProfile } from "../types";
import { colors } from "../theme/colors";
import SmartHubLogo from "./SmartHubLogo";

type Props = { profile: UserProfile | null; onLogout: () => void };

export default function AppHeader({ profile, onLogout }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;

  return (
    <View style={[styles.header, compact && styles.compactHeader]}>
      <View style={[styles.brandRow, compact && styles.compactBrandRow]}>
        <SmartHubLogo showText={false} size={compact ? 36 : 42} />
        <View style={{ flex: 1 }}>
          <Text style={styles.logo}>SmartHub</Text>
          <Text style={styles.subtitle} numberOfLines={2}>
            {profile ? `${profile.name} - ${profile.role === "passenger" ? "Pasajero" : "Conductor"}` : "Movilidad con confianza"}
          </Text>
        </View>
      </View>
      {profile && (
        <TouchableOpacity style={[styles.logoutButton, compact && styles.compactLogoutButton]} onPress={onLogout}>
          <MaterialCommunityIcons name="logout" size={16} color={colors.textMuted} />
          <Text style={styles.logoutText}>Salir</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: 4, marginBottom: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 12, flexWrap: "wrap" },
  compactHeader: { marginBottom: 12, padding: 10, gap: 8 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1, minWidth: 220 },
  compactBrandRow: { minWidth: 180 },
  logo: { fontSize: 19, fontWeight: "900", color: colors.text },
  subtitle: { color: colors.textMuted, marginTop: 1, fontSize: 12, fontWeight: "600" },
  logoutButton: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20, flexDirection: "row", alignItems: "center", gap: 6 },
  compactLogoutButton: { paddingHorizontal: 10, paddingVertical: 8 },
  logoutText: { color: colors.textMuted, fontWeight: "800" },
});
