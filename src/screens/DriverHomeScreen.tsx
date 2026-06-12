import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import EmergencyBanner from "../components/EmergencyBanner";
import TrustScoreBadge from "../components/TrustScoreBadge";
import VerificationChecklist from "../components/VerificationChecklist";
import { DriverProfile, RideRequest, Trip } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { getTripStatusLabel } from "../services/trustScoreService";
import { toNumber } from "../services/pricingService";
import { validatePrice } from "../services/validationService";

type Props = {
  driverProfile: DriverProfile | null;
  pendingRides: RideRequest[];
  driverActiveTrip: Trip | null;
  driverOfferPrice: string;
  setDriverOfferPrice: (value: string) => void;
  onSendOffer: (ride: RideRequest, price?: number) => void;
  onCancelRide: (ride: RideRequest) => void;
  onOpenActiveTrip: (trip: Trip) => void;
  onPenalty: () => void;
  saving: boolean;
};

export default function DriverHomeScreen({ driverProfile, pendingRides, driverActiveTrip, driverOfferPrice, setDriverOfferPrice, onSendOffer, onCancelRide, onOpenActiveTrip, onPenalty, saving }: Props) {
  const firstRide = pendingRides[0];
  const offerValue = firstRide ? toNumber(driverOfferPrice, firstRide.passengerPrice) : 0;
  const offerHint = firstRide && driverOfferPrice.trim() ? validatePrice(offerValue, firstRide.minRecommendedPrice, firstRide.maxRecommendedPrice) : null;

  return (
    <View>
      <Text style={sharedStyles.title}>Panel del conductor</Text>
      <Text style={sharedStyles.subtitle}>Revisa solicitudes, envía oferta y mantén tu puntaje de confianza.</Text>
      {driverProfile && (
        <AppCard>
          <View style={sharedStyles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={sharedStyles.sectionTitle}>{driverProfile.name}</Text>
              <Text style={sharedStyles.text}>{driverProfile.vehicleColor ? `${driverProfile.vehicleColor} · ` : ""}{driverProfile.vehicle} · {driverProfile.plate}</Text>
              <Text style={sharedStyles.text}>⭐ {driverProfile.rating} · {driverProfile.completedTrips} viajes</Text>
            </View>
            <TrustScoreBadge score={driverProfile.trustScore} />
          </View>
          <VerificationChecklist compact />
          <Text style={sharedStyles.text}>Cancelaciones: {(driverProfile.cancellationRate * 100).toFixed(0)}%</Text>
          <Text style={sharedStyles.text}>Estado: {driverProfile.penaltyStatus === "none" ? "Sin penalización" : "Advertencia activa"}</Text>
          <AppButton title="Simular penalización por cancelación" onPress={onPenalty} variant="warning" />
        </AppCard>
      )}
      {driverActiveTrip && (
        <AppCard>
          <EmergencyBanner trip={driverActiveTrip} role="driver" />
          <Text style={sharedStyles.sectionTitle}>Viaje aceptado</Text>
          <Text style={sharedStyles.text}>Pasajero: {driverActiveTrip.passengerName}</Text>
          <Text style={sharedStyles.text}>A: {driverActiveTrip.originName}</Text>
          <Text style={sharedStyles.text}>B: {driverActiveTrip.destinationName}</Text>
          <Text style={sharedStyles.text}>Estado: {getTripStatusLabel(driverActiveTrip.status)}</Text>
          <Text style={styles.locked}>Tarifa pactada: S/ {driverActiveTrip.finalPrice.toFixed(2)}</Text>
          <AppButton title="Ver viaje activo" onPress={() => onOpenActiveTrip(driverActiveTrip)} />
        </AppCard>
      )}
      <AppCard>
        <Text style={sharedStyles.label}>Tu contraoferta</Text>
        <TextInput
          style={[sharedStyles.input, offerHint ? styles.inputWarning : null]}
          value={driverOfferPrice}
          onChangeText={(value) => setDriverOfferPrice(value.replace(/[^0-9.,]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="Ejemplo: 12.50"
          returnKeyType="done"
        />
        {firstRide ? (
          offerHint ? <Text style={sharedStyles.fieldError}>{offerHint}</Text> : <Text style={sharedStyles.fieldOk}>Oferta lista para enviar.</Text>
        ) : (
          <Text style={sharedStyles.fieldHelp}>Cuando haya una solicitud, este monto se enviará como contraoferta.</Text>
        )}
      </AppCard>
      {pendingRides.length === 0 && (
        <AppCard>
          <Text style={sharedStyles.sectionTitle}>No hay solicitudes pendientes</Text>
          <Text style={sharedStyles.text}>Cuando un pasajero publique un viaje, aparecerá aquí.</Text>
        </AppCard>
      )}
      {pendingRides.map((ride) => (
        <AppCard key={ride.id}>
          <Text style={sharedStyles.sectionTitle}>Solicitud de {ride.passengerName}</Text>
          <Text style={sharedStyles.text}>A: {ride.originName}</Text>
          <Text style={sharedStyles.text}>B: {ride.destinationName}</Text>
          <Text style={sharedStyles.text}>Distancia: {ride.distanceKm} km</Text>
          <Text style={sharedStyles.text}>Rango: S/ {ride.minRecommendedPrice.toFixed(2)} - S/ {ride.maxRecommendedPrice.toFixed(2)}</Text>
          {ride.safeNightMode && <Text style={styles.safe}>Viaje seguro nocturno solicitado</Text>}
          {ride.quietMode && <Text style={styles.safe}>Preferencia: modo silencioso</Text>}
          {!!ride.passengerNote && <Text style={sharedStyles.text}>Nota: {ride.passengerNote}</Text>}
          <AppButton title={`Aceptar por S/ ${ride.passengerPrice.toFixed(2)}`} onPress={() => onSendOffer(ride, ride.passengerPrice)} loading={saving} />
          <AppButton title="Enviar contraoferta" onPress={() => onSendOffer(ride)} variant="secondary" loading={saving} />
          <AppButton title="Simular cancelación" onPress={() => onCancelRide(ride)} variant="ghost" />
        </AppCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  locked: { color: colors.secondaryDark, fontWeight: "900", backgroundColor: colors.successSoft, padding: 10, borderRadius: 12, marginTop: 6 },
  safe: { color: colors.primaryDark, fontWeight: "900", marginBottom: 5 },
  inputWarning: { borderColor: colors.warning, backgroundColor: "#FFFBEB" },
});
