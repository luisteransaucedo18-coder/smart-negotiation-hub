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
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(213,222,232,0.82)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.07)",
    elevation: 4,
  },
});
