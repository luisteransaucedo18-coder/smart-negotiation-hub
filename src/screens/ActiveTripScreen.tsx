import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import EmergencyBanner from "../components/EmergencyBanner";
import TripMap from "../components/TripMap";
import TripTimeline from "../components/TripTimeline";
import TrustScoreBadge from "../components/TrustScoreBadge";
import VerificationChecklist from "../components/VerificationChecklist";
import { ChatMessage, Role, Trip } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { getTripStatusLabel } from "../services/trustScoreService";

type Props = {
  trip: Trip;
  role: Role;
  chatMessages: ChatMessage[];
  chatDraft: string;
  setChatDraft: (value: string) => void;
  onSendChatMessage: () => void;
  onStart: () => void;
  onFinish: () => void;
  onEmergency: () => void;
  onResolveEmergency: () => void;
  onShareRoute: () => void;
  onQuickMessage: (text: string) => void;
  onGoRating: () => void;
  onBackDriverPanel: () => void;
};

export default function ActiveTripScreen({ trip, role, chatMessages, chatDraft, setChatDraft, onSendChatMessage, onStart, onFinish, onEmergency, onResolveEmergency, onShareRoute, onQuickMessage, onGoRating, onBackDriverPanel }: Props) {
  const isDriver = role === "driver";
  const emergencyActive = trip.emergencyStatus === "active";
  const isDriverOnWay = trip.status === "driver_on_way";
  const isInProgress = trip.status === "in_progress";
  const isCompleted = trip.status === "completed";

  return (
    <View>
      <Text style={sharedStyles.title}>Viaje protegido</Text>
      <Text style={sharedStyles.subtitle}>Tarifa pactada, ruta visible, identidad verificada y herramientas de seguridad durante el trayecto.</Text>
      <EmergencyBanner trip={trip} role={role} />
      <TripMap originLat={trip.originLat} originLng={trip.originLng} destinationLat={trip.destinationLat} destinationLng={trip.destinationLng} originName={trip.originName} destinationName={trip.destinationName} />
      <TripTimeline status={trip.status} />

      <AppCard>
        <View style={sharedStyles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={sharedStyles.sectionTitle}>{isDriver ? "Datos del pasajero" : "Datos del conductor"}</Text>
            <Text style={sharedStyles.text}>{isDriver ? `Pasajero: ${trip.passengerName}` : `Conductor: ${trip.driverName}`}</Text>
            {!isDriver && <Text style={sharedStyles.text}>{trip.vehicleColor ? `${trip.vehicleColor} - ` : ""}{trip.vehicle} - {trip.plate}</Text>}
            <Text style={sharedStyles.text}>Estado: {getTripStatusLabel(trip.status)}</Text>
          </View>
          {!isDriver && <TrustScoreBadge score={trip.trustScore} />}
        </View>
        {!isDriver && <VerificationChecklist compact />}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>Precio protegido: cero cobros sorpresa</Text>
          <Text style={styles.price}>S/ {trip.finalPrice.toFixed(2)}</Text>
          <Text style={styles.priceHelp}>Esta tarifa queda visible para pasajero y conductor hasta finalizar el viaje.</Text>
        </View>
        {trip.safeNightMode && <Text style={styles.feature}>OK Viaje seguro nocturno activado para estudiantes y trayectos de noche.</Text>}
        {trip.quietMode && <Text style={styles.feature}>OK Modo silencioso solicitado.</Text>}
        {!!trip.passengerNote && <Text style={sharedStyles.text}>Nota: {trip.passengerNote}</Text>}
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Seguridad activa</Text>
        <Text style={sharedStyles.text}>Comparte la ruta con tu contacto de emergencia o activa una alerta si los datos del conductor, vehiculo o ruta no coinciden.</Text>
        <AppButton title="Compartir ruta con contacto" onPress={onShareRoute} variant="secondary" />
        <AppButton title="Boton de emergencia" onPress={onEmergency} variant="danger" />
        {emergencyActive && <AppButton title="Marcar alerta como revisada" onPress={onResolveEmergency} variant="warning" />}
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Mensajes rapidos</Text>
        <AppButton title={isDriver ? "Ya estoy llegando" : "Estoy en el punto indicado"} onPress={() => onQuickMessage(isDriver ? "Ya estoy llegando" : "Estoy en el punto indicado")} variant="secondary" />
        <AppButton title="Confirmo tarifa pactada" onPress={() => onQuickMessage("Confirmo tarifa pactada")} variant="secondary" />
        <AppButton title="Confirmo placa y vehiculo" onPress={() => onQuickMessage("Confirmo placa y vehiculo")} variant="secondary" />
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Chat del viaje</Text>
        <Text style={sharedStyles.text}>Comunicate sin salir de la app. El chat queda asociado al viaje protegido.</Text>
        <View style={styles.chatBox}>
          {chatMessages.length === 0 ? (
            <Text style={styles.emptyChat}>Aun no hay mensajes.</Text>
          ) : (
            chatMessages.map((message) => {
              const own = message.fromRole === role;
              return (
                <View key={message.id} style={[styles.messageBubble, own ? styles.ownBubble : styles.otherBubble]}>
                  <Text style={[styles.messageAuthor, own ? styles.ownAuthor : styles.otherAuthor]}>{own ? "Tu" : message.fromName}</Text>
                  <Text style={[styles.messageText, own ? styles.ownMessageText : styles.otherMessageText]}>{message.text}</Text>
                  {message.localOnly && <Text style={[styles.localTag, own ? styles.ownLocalTag : styles.otherLocalTag]}>modo demo</Text>}
                </View>
              );
            })
          )}
        </View>
        <TextInput
          style={[sharedStyles.input, styles.chatInput]}
          value={chatDraft}
          onChangeText={setChatDraft}
          placeholder={isDriver ? "Escribe al pasajero..." : "Escribe al conductor..."}
          multiline
          maxLength={180}
          textAlignVertical="top"
        />
        <AppButton title="Enviar mensaje" onPress={onSendChatMessage} variant="secondary" />
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Control del viaje</Text>
        {isDriver ? (
          emergencyActive ? (
            <>
              <Text style={styles.blocked}>Hay una alerta activa. Revisa la situacion y marca la alerta como revisada antes de continuar.</Text>
              <AppButton title="Volver al panel" onPress={onBackDriverPanel} variant="ghost" />
            </>
          ) : (
            <>
              {isDriverOnWay && <AppButton title="Iniciar viaje" onPress={onStart} variant="success" />}
              {isInProgress && <AppButton title="Finalizar viaje" onPress={onFinish} variant="secondary" />}
              {isCompleted && (
                <View style={styles.noticeBox}>
                  <Text style={styles.noticeTitle}>Viaje finalizado</Text>
                  <Text style={styles.noticeText}>El pasajero ya puede calificar. Esa calificacion alimenta el puntaje de confianza.</Text>
                </View>
              )}
              <AppButton title="Volver al panel" onPress={onBackDriverPanel} variant="ghost" />
            </>
          )
        ) : isCompleted ? (
          <AppButton title="Calificar viaje" onPress={onGoRating} />
        ) : (
          <Text style={styles.blocked}>El conductor controla el inicio y finalizacion. Tu puedes monitorear el estado, compartir ruta o activar seguridad.</Text>
        )}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  priceBox: { backgroundColor: colors.successSoft, borderRadius: 12, padding: 15, marginVertical: 12, borderWidth: 1, borderColor: "#B7E8CF" },
  priceLabel: { color: colors.secondaryDark, fontWeight: "900" },
  price: { color: colors.text, fontSize: 28, fontWeight: "900", marginTop: 4 },
  priceHelp: { color: colors.secondaryDark, marginTop: 4 },
  feature: { color: colors.primaryDark, fontWeight: "900", marginBottom: 5, lineHeight: 20 },
  blocked: { backgroundColor: colors.warningSoft, color: "#92400E", borderRadius: 12, padding: 13, lineHeight: 20, fontWeight: "800", borderWidth: 1, borderColor: "#FDE68A" },
  noticeBox: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: 13, borderWidth: 1, borderColor: "#C7D7FE" },
  noticeTitle: { color: colors.primaryDark, fontWeight: "900", marginBottom: 4 },
  noticeText: { color: colors.primaryDark, lineHeight: 20, fontWeight: "700" },
  chatBox: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, marginBottom: 12 },
  emptyChat: { color: colors.textMuted, textAlign: "center", paddingVertical: 12, fontWeight: "700" },
  messageBubble: { maxWidth: "94%", borderRadius: 12, padding: 10, marginBottom: 9 },
  ownBubble: { alignSelf: "flex-end", backgroundColor: colors.primary },
  otherBubble: { alignSelf: "flex-start", backgroundColor: colors.successSoft },
  messageAuthor: { fontSize: 12, fontWeight: "900", marginBottom: 3 },
  ownAuthor: { color: "#DBEAFE" },
  otherAuthor: { color: colors.secondaryDark },
  messageText: { lineHeight: 19, fontWeight: "700" },
  ownMessageText: { color: "#FFFFFF" },
  otherMessageText: { color: colors.secondaryDark },
  localTag: { fontSize: 10, marginTop: 5, fontWeight: "900" },
  ownLocalTag: { color: "#BFDBFE" },
  otherLocalTag: { color: colors.secondaryDark },
  chatInput: { minHeight: 72, textAlignVertical: "top" },
});
