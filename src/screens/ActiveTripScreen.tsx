import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import EmergencyBanner from "../components/EmergencyBanner";
import TripMap from "../components/TripMap";
import TripTimeline from "../components/TripTimeline";
import TrustScoreBadge from "../components/TrustScoreBadge";
import VerificationChecklist from "../components/VerificationChecklist";
import { Role, Trip } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { getTripStatusLabel } from "../services/trustScoreService";

type Props = {
  trip: Trip;
  role: Role;
  onStart: () => void;
  onFinish: () => void;
  onEmergency: () => void;
  onResolveEmergency: () => void;
  onShareRoute: () => void;
  onQuickMessage: (text: string) => void;
  onGoRating: () => void;
  onBackDriverPanel: () => void;
};

export default function ActiveTripScreen({ trip, role, onStart, onFinish, onEmergency, onResolveEmergency, onShareRoute, onQuickMessage, onGoRating, onBackDriverPanel }: Props) {
  const isDriver = role === "driver";
  const emergencyActive = trip.emergencyStatus === "active";
  const isDriverOnWay = trip.status === "driver_on_way";
  const isInProgress = trip.status === "in_progress";
  const isCompleted = trip.status === "completed";

  return (
    <View>
      <Text style={sharedStyles.title}>Viaje activo</Text>
      <Text style={sharedStyles.subtitle}>Tarifa pactada, ruta, identidad y herramientas de seguridad.</Text>
      <EmergencyBanner trip={trip} role={role} />
      <TripMap originLat={trip.originLat} originLng={trip.originLng} destinationLat={trip.destinationLat} destinationLng={trip.destinationLng} originName={trip.originName} destinationName={trip.destinationName} />
      <TripTimeline status={trip.status} />

      <AppCard>
        <View style={sharedStyles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={sharedStyles.sectionTitle}>{isDriver ? "Datos del pasajero" : "Datos del conductor"}</Text>
            <Text style={sharedStyles.text}>{isDriver ? `Pasajero: ${trip.passengerName}` : `Conductor: ${trip.driverName}`}</Text>
            {!isDriver && <Text style={sharedStyles.text}>{trip.vehicleColor ? `${trip.vehicleColor} · ` : ""}{trip.vehicle} · {trip.plate}</Text>}
            <Text style={sharedStyles.text}>Estado: {getTripStatusLabel(trip.status)}</Text>
          </View>
          {!isDriver && <TrustScoreBadge score={trip.trustScore} />}
        </View>
        {!isDriver && <VerificationChecklist compact />}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Tarifa pactada bloqueada</Text>
          <Text style={styles.price}>S/ {trip.finalPrice.toFixed(2)}</Text>
          <Text style={styles.priceHelp}>Esta tarifa queda visible para evitar cobros adicionales.</Text>
        </View>
        {trip.safeNightMode && <Text style={styles.feature}>✓ Viaje seguro nocturno</Text>}
        {trip.quietMode && <Text style={styles.feature}>✓ Modo silencioso solicitado</Text>}
        {!!trip.passengerNote && <Text style={sharedStyles.text}>Nota: {trip.passengerNote}</Text>}
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Acciones de seguridad</Text>
        <AppButton title="Compartir ruta con contacto" onPress={onShareRoute} variant="secondary" />
        <AppButton title="Botón de emergencia" onPress={onEmergency} variant="danger" />
        {emergencyActive && <AppButton title="Marcar alerta como revisada" onPress={onResolveEmergency} variant="warning" />}
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Mensajes rápidos</Text>
        <AppButton title={isDriver ? "Ya estoy llegando" : "Estoy en el punto indicado"} onPress={() => onQuickMessage(isDriver ? "Ya estoy llegando" : "Estoy en el punto indicado")} variant="secondary" />
        <AppButton title="Confirmo tarifa pactada" onPress={() => onQuickMessage("Confirmo tarifa pactada")} variant="secondary" />
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Control del viaje</Text>
        {isDriver ? (
          emergencyActive ? (
            <>
              <Text style={styles.blocked}>Hay una alerta activa. Revisa la situación y marca la alerta como revisada antes de continuar.</Text>
              <AppButton title="Volver al panel" onPress={onBackDriverPanel} variant="ghost" />
            </>
          ) : (
            <>
              {isDriverOnWay && <AppButton title="Iniciar viaje" onPress={onStart} variant="success" />}
              {isInProgress && <AppButton title="Finalizar viaje" onPress={() => Alert.alert("Confirmar", "¿Finalizar este viaje?", [{ text: "No" }, { text: "Sí", onPress: onFinish }])} variant="secondary" />}
              {isCompleted && (
                <View style={styles.noticeBox}>
                  <Text style={styles.noticeTitle}>Viaje finalizado</Text>
                  <Text style={styles.noticeText}>El pasajero ya puede calificar. Cuando califique, este viaje dejará de aparecer como activo.</Text>
                </View>
              )}
              <AppButton title="Volver al panel" onPress={onBackDriverPanel} variant="ghost" />
            </>
          )
        ) : isCompleted ? (
          <AppButton title="Calificar viaje" onPress={onGoRating} />
        ) : (
          <Text style={styles.blocked}>El conductor controla el inicio y finalización. Tú puedes monitorear el estado, compartir ruta o activar seguridad.</Text>
        )}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  priceBox: { backgroundColor: colors.successSoft, borderRadius: 18, padding: 15, marginVertical: 12 },
  priceLabel: { color: colors.secondaryDark, fontWeight: "900" },
  price: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 4 },
  priceHelp: { color: colors.secondaryDark, marginTop: 4 },
  feature: { color: colors.primaryDark, fontWeight: "900", marginBottom: 5 },
  blocked: { backgroundColor: colors.warningSoft, color: "#92400E", borderRadius: 15, padding: 13, lineHeight: 20, fontWeight: "800" },
  noticeBox: { backgroundColor: colors.primarySoft, borderRadius: 15, padding: 13 },
  noticeTitle: { color: colors.primaryDark, fontWeight: "900", marginBottom: 4 },
  noticeText: { color: colors.primaryDark, lineHeight: 20, fontWeight: "700" },
});
