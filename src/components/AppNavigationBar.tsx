import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";
import { Role, ScreenName } from "../types";

type NavigationKey = "home" | "activity" | "trip" | "security" | "profile";

type NavItem = {
  key: NavigationKey;
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  target: ScreenName;
  disabled?: boolean;
};

type Props = {
  role: Role;
  screen: ScreenName;
  hasPendingRide: boolean;
  hasActiveTrip: boolean;
  onNavigate: (screen: ScreenName) => void;
};

export default function AppNavigationBar({ role, screen, hasPendingRide, hasActiveTrip, onNavigate }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;
  const passengerItems: NavItem[] = [
    { key: "home", label: "Inicio", icon: "home-variant-outline", target: "passengerHome" },
    { key: "activity", label: "Ofertas", icon: "swap-horizontal", target: "waitingOffers", disabled: !hasPendingRide },
    { key: "trip", label: "Viaje", icon: "map-marker-path", target: "activeTrip", disabled: !hasActiveTrip },
    { key: "profile", label: "Perfil", icon: "shield-account-outline", target: "profile" },
  ];
  const driverItems: NavItem[] = [
    { key: "home", label: "Panel", icon: "view-dashboard-outline", target: "driverHome" },
    { key: "activity", label: "Solicitudes", icon: "clipboard-list-outline", target: "driverHome" },
    { key: "trip", label: "Viaje", icon: "map-marker-path", target: "activeTrip", disabled: !hasActiveTrip },
    { key: "profile", label: "Perfil", icon: "card-account-details-outline", target: "profile" },
  ];
  const items = role === "passenger" ? passengerItems : driverItems;

  return (
    <View style={[styles.shell, compact && styles.compactShell]}>
      <View style={[styles.bar, compact && styles.compactBar]}>
        {items.map((item) => {
          const active = isActive(item, screen);
          const color = item.disabled ? colors.muted : active ? "#FFFFFF" : colors.textMuted;
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.82}
              style={[styles.item, compact && styles.compactItem, active && styles.activeItem, item.disabled && styles.disabledItem]}
              onPress={() => !item.disabled && onNavigate(item.target)}
              disabled={item.disabled}
            >
              <MaterialCommunityIcons name={item.icon} size={compact ? 20 : 22} color={color} />
              <Text style={[styles.label, compact && styles.compactLabel, active && styles.activeLabel, item.disabled && styles.disabledLabel]} numberOfLines={1}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function isActive(item: NavItem, screen: ScreenName) {
  if (item.key === "profile") return screen === "profile";
  if (item.key === "trip") return screen === "activeTrip" || screen === "rating";
  if (item.key === "activity") return screen === "waitingOffers";
  return screen === "passengerHome" || screen === "driverHome";
}

const styles = StyleSheet.create({
  shell: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(247,248,250,0.96)",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
  },
  compactShell: {
    paddingHorizontal: 12,
    paddingTop: 6,
    paddingBottom: 8,
  },
  bar: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 6,
    flexDirection: "row",
    gap: 6,
  },
  compactBar: {
    padding: 5,
    gap: 4,
  },
  item: {
    flex: 1,
    minHeight: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  compactItem: {
    minHeight: 48,
    paddingHorizontal: 2,
  },
  activeItem: {
    backgroundColor: colors.ink,
  },
  compactLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  disabledItem: {
    opacity: 0.52,
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "800",
    marginTop: 4,
  },
  activeLabel: {
    color: "#FFFFFF",
  },
  disabledLabel: {
    color: colors.muted,
  },
});
