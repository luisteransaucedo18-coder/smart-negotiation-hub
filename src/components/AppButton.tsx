import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { colors } from "../theme/colors";

type Variant = "primary" | "secondary" | "danger" | "ghost" | "success" | "warning";

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AppButton({ title, onPress, variant = "primary", loading = false, disabled = false, style }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      style={[styles.button, styles[variant], disabled && styles.disabled, style]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" || variant === "danger" || variant === "success" ? "#FFFFFF" : colors.primary} />
      ) : (
        <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles]]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 50, width: "100%", paddingVertical: 14, paddingHorizontal: 16, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 10 },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: "#C7D7FE" },
  danger: { backgroundColor: colors.danger },
  ghost: { backgroundColor: "transparent" },
  success: { backgroundColor: colors.success },
  warning: { backgroundColor: colors.warningSoft, borderWidth: 1, borderColor: "#FDE68A" },
  disabled: { opacity: 0.55 },
  text: { fontSize: 16, fontWeight: "900", textAlign: "center", flexShrink: 1 },
  primaryText: { color: "#FFFFFF" },
  secondaryText: { color: colors.primaryDark },
  dangerText: { color: "#FFFFFF" },
  ghostText: { color: colors.primary },
  successText: { color: "#FFFFFF" },
  warningText: { color: "#92400E" },
});
