import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { colors } from "../theme/colors";

export type OnboardingVisual = "route" | "driver" | "savings";

type Props = {
  visual: OnboardingVisual;
};

export default function OnboardingMapCard({ visual }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;

  if (visual === "savings") return <SavingsVisual compact={compact} />;

  const isDriver = visual === "driver";

  return (
    <View style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.gridOverlay} />
      <View style={styles.roadA} />
      <View style={styles.roadB} />
      <View style={styles.roadC} />

      {isDriver && (
        <View style={styles.ratingBanner}>
          <MaterialCommunityIcons name="star" size={13} color={colors.warning} />
          <Text style={styles.ratingBannerText}>4.9 · conductor verificado</Text>
        </View>
      )}

      <View style={[styles.cityPin, styles.originPin]}>
        <View style={styles.pinDot} />
        <Text style={styles.pinText}>{isDriver ? "Centro" : "UTP Trujillo"}</Text>
      </View>
      <View style={[styles.cityPin, styles.destinationPin]}>
        <View style={[styles.pinDot, styles.destinationDot]} />
        <Text style={styles.pinText}>{isDriver ? "El Golf" : "Mall Plaza"}</Text>
      </View>

      <View style={styles.routeLine} />
      <View style={styles.playButton}>
        <MaterialCommunityIcons name="play" size={28} color="#FFFFFF" />
      </View>

      <View style={styles.tripSummary}>
        {isDriver ? (
          <>
            <View style={styles.driverAvatar}>
              <Text style={styles.driverAvatarText}>M</Text>
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryValue}>Marco C.</Text>
              <Text style={styles.summaryLabel}>Toyota Yaris · ABC-123</Text>
              <Text style={styles.instantTag}>Disponible ahora</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Oferta</Text>
              <Text style={styles.price}>S/ 13</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.summaryIcon}>
              <MaterialCommunityIcons name="map-marker-path" size={21} color={colors.secondaryDark} />
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryLabel}>Llegada estimada</Text>
              <Text style={styles.summaryValue}>18 min · 6.4 km</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Protegida</Text>
              <Text style={styles.price}>S/ 12.50</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

function SavingsVisual({ compact }: { compact: boolean }) {
  const avatars = ["L", "M", "A", "C", "R"];

  return (
    <View style={[styles.card, compact && styles.compactCard, styles.savingsCard]}>
      <View style={styles.savingsTopBadge}>
        <MaterialCommunityIcons name="star" size={14} color={colors.warning} />
        <Text style={styles.savingsBadgeText}>4.9 · prom. ahorro</Text>
      </View>

      <View style={styles.avatarRow}>
        {avatars.map((avatar, index) => (
          <View key={avatar} style={[styles.groupAvatar, index > 0 && styles.avatarOverlap]}>
            <Text style={styles.groupAvatarText}>{avatar}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.bigSaving}>S/ 120+</Text>
      <Text style={styles.savingHelp}>ahorrados con tarifas negociadas</Text>

      <View style={styles.playButton}>
        <MaterialCommunityIcons name="play" size={28} color="#FFFFFF" />
      </View>

      <View style={styles.discountBadge}>
        <Text style={styles.discountValue}>75%</Text>
        <Text style={styles.discountText}>mas justo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    aspectRatio: 0.86,
    maxHeight: 360,
    backgroundColor: "#F0F4F8",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    marginTop: 22,
    marginBottom: 28,
  },
  compactCard: {
    maxHeight: 300,
    marginTop: 14,
    marginBottom: 18,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.42)",
  },
  roadA: {
    position: "absolute",
    width: "130%",
    height: 9,
    backgroundColor: "#D7E0EA",
    top: "34%",
    left: "-15%",
    transform: [{ rotate: "-13deg" }],
  },
  roadB: {
    position: "absolute",
    width: "120%",
    height: 8,
    backgroundColor: "#DCE7F4",
    top: "52%",
    left: "-10%",
    transform: [{ rotate: "23deg" }],
  },
  roadC: {
    position: "absolute",
    width: "86%",
    height: 7,
    backgroundColor: "#D6ECEA",
    top: "43%",
    right: "-10%",
    transform: [{ rotate: "82deg" }],
  },
  cityPin: {
    position: "absolute",
    zIndex: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  ratingBanner: {
    position: "absolute",
    left: 18,
    top: 30,
    zIndex: 3,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ratingBannerText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  originPin: {
    left: 18,
    top: 58,
  },
  destinationPin: {
    right: 18,
    top: 92,
  },
  pinDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  destinationDot: {
    backgroundColor: colors.secondary,
  },
  pinText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  routeLine: {
    position: "absolute",
    width: "56%",
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
    alignSelf: "center",
    transform: [{ rotate: "21deg" }],
    opacity: 0.76,
  },
  playButton: {
    alignSelf: "center",
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "rgba(31,41,55,0.82)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  tripSummary: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 16,
    minHeight: 72,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryIcon: {
    width: 42,
    height: 42,
    borderRadius: 20,
    backgroundColor: colors.secondarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  driverAvatar: {
    width: 42,
    height: 42,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  driverAvatarText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 104,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 2,
  },
  summaryValue: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 14,
  },
  priceBox: {
    alignItems: "flex-end",
  },
  priceLabel: {
    color: colors.secondaryDark,
    fontWeight: "900",
    fontSize: 11,
    marginBottom: 2,
  },
  price: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 19,
  },
  instantTag: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: colors.secondarySoft,
    color: colors.secondaryDark,
    fontWeight: "900",
    fontSize: 11,
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
    overflow: "hidden",
  },
  savingsCard: {
    backgroundColor: "#8BEA3C",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#78D92D",
  },
  savingsTopBadge: {
    position: "absolute",
    top: 18,
    left: 18,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  savingsBadgeText: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 12,
  },
  avatarRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  groupAvatar: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: "#8BEA3C",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  groupAvatarText: {
    color: colors.primaryDark,
    fontWeight: "900",
  },
  bigSaving: {
    color: colors.text,
    fontSize: 43,
    fontWeight: "900",
    lineHeight: 48,
  },
  savingHelp: {
    color: "rgba(23,32,51,0.68)",
    fontWeight: "900",
    fontSize: 12,
  },
  discountBadge: {
    position: "absolute",
    right: 20,
    bottom: 34,
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  discountValue: {
    color: colors.text,
    fontWeight: "900",
    fontSize: 15,
  },
  discountText: {
    color: colors.textMuted,
    fontWeight: "900",
    fontSize: 11,
  },
});
