import React, { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../theme/colors";
import FadeInView from "./FadeInView";

export default function AppCard({ children }: PropsWithChildren) {
  return (
    <FadeInView style={styles.card}>
      <View>{children}</View>
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
});
