import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Offer } from "../types";
import { colors } from "../theme/colors";
import TrustScoreBadge from "./TrustScoreBadge";

export default function DriverMiniCard({ offer }: { offer: Offer }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=160&q=80" }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{offer.driverName}</Text>
        <Text style={styles.text}>{offer.vehicleColor ? `${offer.vehicleColor} - ` : ""}{offer.vehicle} - {offer.plate}</Text>
        <Text style={styles.text}>{offer.rating} estrellas - {offer.completedTrips} viajes completados</Text>
        <Text style={styles.verified}>Conductor verificado para precio protegido</Text>
      </View>
      <TrustScoreBadge score={offer.trustScore} compact />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, alignItems: "center", flexWrap: "wrap" },
  avatar: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.primarySoft },
  info: { flex: 1, minWidth: 170 },
  name: { fontSize: 17, fontWeight: "900", color: colors.text },
  text: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  verified: { color: colors.secondaryDark, fontSize: 12, marginTop: 4, fontWeight: "900" },
});
