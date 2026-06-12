import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import DriverMiniCard from "../components/DriverMiniCard";
import PriceCard from "../components/PriceCard";
import VerificationChecklist from "../components/VerificationChecklist";
import { Offer, RideRequest } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";

type Props = { ride: RideRequest | null; offers: Offer[]; onAcceptOffer: (offer: Offer) => void; onBack: () => void; saving: boolean };

export default function WaitingOffersScreen({ ride, offers, onAcceptOffer, onBack, saving }: Props) {
  if (!ride) return null;
  return (
    <View>
      <Text style={sharedStyles.title}>Ofertas recibidas</Text>
      <Text style={sharedStyles.subtitle}>Compara tarifa, placa, vehículo y puntaje de confianza antes de aceptar.</Text>
      <PriceCard suggestedPrice={ride.suggestedPrice} minPrice={ride.minRecommendedPrice} maxPrice={ride.maxRecommendedPrice} distanceKm={String(ride.distanceKm)} isPeakHour={false} safeNightMode={ride.safeNightMode} />
      <View style={styles.routeBox}>
        <Text style={styles.routeText}>A: {ride.originName}</Text>
        <Text style={styles.routeText}>B: {ride.destinationName}</Text>
      </View>
      {offers.length === 0 && (
        <AppCard>
          <Text style={sharedStyles.sectionTitle}>Esperando conductores...</Text>
          <Text style={sharedStyles.text}>La solicitud está publicada. Cuando un conductor envíe oferta aparecerá aquí.</Text>
        </AppCard>
      )}
      {offers.map((offer) => (
        <AppCard key={offer.id}>
          <View style={styles.offerTop}>
            <Text style={styles.tag}>{offer.recommendationLabel || "Comparar"}</Text>
            <Text style={styles.price}>S/ {offer.offeredPrice.toFixed(2)}</Text>
          </View>
          <DriverMiniCard offer={offer} />
          <VerificationChecklist compact />
          <AppButton title="Aceptar esta oferta" onPress={() => onAcceptOffer(offer)} loading={saving} />
        </AppCard>
      ))}
      <AppButton title="Volver a editar viaje" onPress={onBack} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  routeBox: { backgroundColor: colors.primarySoft, borderRadius: 16, padding: 14, marginBottom: 14 },
  routeText: { color: colors.primaryDark, fontWeight: "800", marginBottom: 4 },
  offerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  tag: { backgroundColor: colors.secondarySoft, color: colors.secondaryDark, fontWeight: "900", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  price: { fontSize: 28, color: colors.text, fontWeight: "900" },
});
