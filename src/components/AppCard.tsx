import React, { PropsWithChildren } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";
import FadeInView from "./FadeInView";

export default function AppCard({ children }: PropsWithChildren) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;

  return (
    <FadeInView style={[styles.card, compact && styles.compactCard]}>
      <View>{children}</View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactCard: {
    padding: 14,
    marginBottom: 12,
  },
});
