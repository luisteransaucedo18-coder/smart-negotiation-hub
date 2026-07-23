import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, useWindowDimensions, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
};

export default function AppButton({ title, onPress, variant = "primary", loading = false, disabled = false, style, icon }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;
  const filled = variant === "primary" || variant === "danger" || variant === "success";
  const iconColor = filled ? "#FFFFFF" : variant === "warning" ? "#7A5518" : colors.text;

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={[styles.button, compact && styles.compactButton, styles[variant], disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={filled ? "#FFFFFF" : colors.primary} />
      ) : (
        <>
          {icon && <MaterialCommunityIcons name={icon} size={compact ? 17 : 18} color={iconColor} style={styles.icon} />}
          <Text style={[styles.text, compact && styles.compactText, styles[`${variant}Text` as keyof typeof styles]]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, width: "100%", paddingVertical: 14, paddingHorizontal: 18, borderRadius: 20, alignItems: "center", justifyContent: "center", marginTop: 10, flexDirection: "row" },
  compactButton: { minHeight: 46, paddingVertical: 11, paddingHorizontal: 14, marginTop: 8 },
  primary: { backgroundColor: colors.ink },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: colors.warningSoft, borderWidth: 1, borderColor: "#E7D4A9" },
  disabled: { opacity: 0.55 },
  icon: { marginRight: 8 },
  text: { fontSize: 15, fontWeight: "800", textAlign: "center", flexShrink: 1 },
  compactText: { fontSize: 14 },
  primaryText: { color: "#FFFFFF" },
  secondaryText: { color: colors.text },
  dangerText: { color: "#FFFFFF" },
  ghostText: { color: colors.text },
  successText: { color: "#FFFFFF" },
  warningText: { color: "#7A5518" },
});
