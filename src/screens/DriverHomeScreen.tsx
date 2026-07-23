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
      <Text style={sharedStyles.title}>Panel conductor</Text>
      <Text style={sharedStyles.subtitle}>Solicitudes claras y contraofertas rentables.</Text>
      {driverProfile && (
        <AppCard>
          <View style={sharedStyles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={sharedStyles.sectionTitle}>{driverProfile.name}</Text>
              <Text style={sharedStyles.text}>{driverProfile.vehicleColor ? `${driverProfile.vehicleColor} - ` : ""}{driverProfile.vehicle} - {driverProfile.plate}</Text>
              <Text style={sharedStyles.text}>Licencia: {driverProfile.licenseNumber || "validada"}</Text>
              <Text style={sharedStyles.text}>{driverProfile.rating} estrellas - {driverProfile.completedTrips} viajes completados</Text>
            </View>
            <TrustScoreBadge score={driverProfile.trustScore} />
          </View>
          <VerificationChecklist compact />
          <View style={styles.driverStats}>
            <Text style={styles.statText}>Cancelaciones: {(driverProfile.cancellationRate * 100).toFixed(0)}%</Text>
            <Text style={styles.statText}>Estado: {getPenaltyLabel(driverProfile.penaltyStatus)}</Text>
          </View>
          <Text style={styles.infoText}>Un mejor historial aumenta la confianza del pasajero y ayuda a aceptar ofertas mas justas.</Text>
          <AppButton title="Simular penalizacion por cancelacion" icon="alert-outline" onPress={onPenalty} variant="warning" />
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
          <Text style={styles.locked}>Precio protegido: S/ {driverActiveTrip.finalPrice.toFixed(2)}</Text>
          <AppButton title="Ver viaje activo" icon="map-marker-path" onPress={() => onOpenActiveTrip(driverActiveTrip)} />
        </AppCard>
      )}
      <AppCard>
        <Text style={sharedStyles.label}>Tu contraoferta rentable</Text>
        <TextInput
          style={[sharedStyles.input, offerHint ? styles.inputWarning : null]}
          value={driverOfferPrice}
          onChangeText={(value) => setDriverOfferPrice(value.replace(/[^0-9.,]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="Ejemplo: 12.50"
          returnKeyType="done"
        />
        {firstRide ? (
          offerHint ? <Text style={sharedStyles.fieldError}>{offerHint}</Text> : <Text style={sharedStyles.fieldOk}>Oferta lista dentro del rango justo.</Text>
        ) : (
          <Text style={sharedStyles.fieldHelp}>Cuando haya una solicitud, este monto se enviara como contraoferta.</Text>
        )}
      </AppCard>
      {pendingRides.length === 0 && (
        <AppCard>
          <Text style={sharedStyles.sectionTitle}>No hay solicitudes pendientes</Text>
          <Text style={sharedStyles.text}>Cuando un pasajero publique un viaje en Trujillo, aparecera aqui.</Text>
        </AppCard>
      )}
      {pendingRides.map((ride) => (
        <AppCard key={ride.id}>
          <Text style={sharedStyles.sectionTitle}>Solicitud de {ride.passengerName}</Text>
          <Text style={sharedStyles.text}>A: {ride.originName}</Text>
          <Text style={sharedStyles.text}>B: {ride.destinationName}</Text>
          <Text style={sharedStyles.text}>Distancia: {ride.distanceKm} km</Text>
          <Text style={sharedStyles.text}>Rango justo: S/ {ride.minRecommendedPrice.toFixed(2)} - S/ {ride.maxRecommendedPrice.toFixed(2)}</Text>
          <Text style={styles.locked}>Propuesta del pasajero: S/ {ride.passengerPrice.toFixed(2)} protegida si aceptas.</Text>
          {ride.safeNightMode && <Text style={styles.safe}>Viaje seguro nocturno solicitado: prioriza verificacion y ruta compartida.</Text>}
          {ride.quietMode && <Text style={styles.safe}>Preferencia: modo silencioso.</Text>}
          {!!ride.passengerNote && <Text style={sharedStyles.text}>Nota: {ride.passengerNote}</Text>}
          <AppButton title={`Aceptar precio protegido S/ ${ride.passengerPrice.toFixed(2)}`} icon="shield-check-outline" onPress={() => onSendOffer(ride, ride.passengerPrice)} loading={saving} />
          <AppButton title="Enviar contraoferta" icon="swap-horizontal" onPress={() => onSendOffer(ride)} variant="secondary" loading={saving} />
          <AppButton title="Simular cancelacion" icon="close-circle-outline" onPress={() => onCancelRide(ride)} variant="ghost" />
        </AppCard>
      ))}
    </View>
  );
}

function getPenaltyLabel(status: DriverProfile["penaltyStatus"]) {
  if (status === "none") return "Sin penalizacion";
  if (status === "warning_simulated") return "Advertencia activa";
  return "Restringido por cancelaciones";
}

const styles = StyleSheet.create({
  locked: { color: colors.secondaryDark, fontWeight: "900", backgroundColor: colors.successSoft, padding: 12, borderRadius: 20, marginTop: 6, marginBottom: 6 },
  safe: { color: colors.primaryDark, fontWeight: "900", marginBottom: 5, lineHeight: 20 },
  inputWarning: { borderColor: colors.warning, backgroundColor: "#FFFBEB" },
  driverStats: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginVertical: 8 },
  statText: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6, color: colors.text, fontWeight: "800", fontSize: 12 },
  infoText: { color: colors.textMuted, lineHeight: 20, marginBottom: 10 },
});
