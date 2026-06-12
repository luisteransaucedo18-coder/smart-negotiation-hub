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
      <Text style={sharedStyles.title}>Negociacion inteligente</Text>
      <Text style={sharedStyles.subtitle}>Compara contraofertas con tarifa, placa, vehiculo y puntaje de confianza antes de aceptar.</Text>
      <PriceCard suggestedPrice={ride.suggestedPrice} minPrice={ride.minRecommendedPrice} maxPrice={ride.maxRecommendedPrice} distanceKm={String(ride.distanceKm)} isPeakHour={false} safeNightMode={ride.safeNightMode} />
      <View style={styles.routeBox}>
        <Text style={styles.routeTitle}>Solicitud publicada</Text>
        <Text style={styles.routeText}>A: {ride.originName}</Text>
        <Text style={styles.routeText}>B: {ride.destinationName}</Text>
        <Text style={styles.locked}>Tu propuesta: S/ {ride.passengerPrice.toFixed(2)}. Al aceptar una oferta, el precio queda protegido.</Text>
      </View>
      <AppCard>
        <View style={styles.riskTop}>
          <Text style={styles.riskTag}>No recomendado</Text>
          <Text style={styles.riskPrice}>S/ 10.00</Text>
        </View>
        <Text style={styles.riskTitle}>Oferta insegura detectada</Text>
        <Text style={sharedStyles.text}>El conductor no coincide con el perfil, el vehiculo reporta baja condicion y el precio intenta cambiar fuera de la app.</Text>
      </AppCard>
      {offers.length === 0 && (
        <AppCard>
          <Text style={sharedStyles.sectionTitle}>Esperando conductores verificados</Text>
          <Text style={sharedStyles.text}>La solicitud esta publicada. Cuando un conductor envie oferta, aparecera aqui con su filtro de confianza.</Text>
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
          <View style={styles.protectionBox}>
            <Text style={styles.protectionTitle}>Precio protegido</Text>
            <Text style={styles.protectionText}>Si aceptas, esta tarifa queda pactada para evitar cobros adicionales al finalizar.</Text>
          </View>
          <AppButton title="Aceptar oferta protegida" onPress={() => onAcceptOffer(offer)} loading={saving} />
        </AppCard>
      ))}
      <AppButton title="Volver a editar viaje" onPress={onBack} variant="ghost" />
    </View>
  );
}

const styles = StyleSheet.create({
  routeBox: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: "#C7D7FE" },
  routeTitle: { color: colors.primaryDark, fontWeight: "900", marginBottom: 5 },
  routeText: { color: colors.primaryDark, fontWeight: "800", marginBottom: 4 },
  locked: { color: colors.primaryDark, fontWeight: "900", lineHeight: 20, marginTop: 6 },
  offerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  tag: { backgroundColor: colors.secondarySoft, color: colors.secondaryDark, fontWeight: "900", paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  price: { fontSize: 28, color: colors.text, fontWeight: "900" },
  protectionBox: { backgroundColor: colors.successSoft, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: "#B7E8CF" },
  protectionTitle: { color: colors.secondaryDark, fontWeight: "900", marginBottom: 3 },
  protectionText: { color: colors.secondaryDark, lineHeight: 19 },
  riskTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 },
  riskTag: { backgroundColor: colors.dangerSoft, color: colors.danger, fontWeight: "900", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  riskPrice: { color: colors.danger, fontWeight: "900", fontSize: 22 },
  riskTitle: { color: colors.text, fontWeight: "900", fontSize: 17, marginBottom: 5 },
});
