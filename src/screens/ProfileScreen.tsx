import React from "react";
import { StyleSheet, Text, View } from "react-native";
import AppCard from "../components/AppCard";
import AppButton from "../components/AppButton";
import TrustScoreBadge from "../components/TrustScoreBadge";
import VerificationChecklist from "../components/VerificationChecklist";
import { DriverProfile, Trip, UserProfile } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";

type Props = {
  profile: UserProfile;
  driverProfile: DriverProfile | null;
  activeTrip: Trip | null;
  onOpenActiveTrip: () => void;
  onLogout: () => void;
};

export default function ProfileScreen({ profile, driverProfile, activeTrip, onOpenActiveTrip, onLogout }: Props) {
  const isDriver = profile.role === "driver";

  return (
    <View>
      <Text style={sharedStyles.title}>Perfil y seguridad</Text>
      <Text style={sharedStyles.subtitle}>Identidad, emergencia y estado operativo.</Text>

      <AppCard>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.trim().charAt(0).toUpperCase() || "S"}</Text>
          </View>
          <View style={styles.identityCopy}>
            <Text style={sharedStyles.sectionTitle}>{profile.name}</Text>
            <Text style={sharedStyles.text}>{isDriver ? "Conductor verificado" : "Pasajero protegido"}</Text>
            <Text style={sharedStyles.text}>{profile.email}</Text>
          </View>
        </View>
        <View style={styles.flatStats}>
          <InfoPill label="DNI" value={profile.dni || "Pendiente"} />
          <InfoPill label="Rol" value={isDriver ? "Conductor" : "Pasajero"} />
        </View>
      </AppCard>

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Contacto de emergencia</Text>
        <Text style={sharedStyles.text}>{profile.emergencyContactName || "Contacto no registrado"}</Text>
        <Text style={sharedStyles.text}>{profile.emergencyContactPhone || "Telefono pendiente"}</Text>
        <Text style={styles.relationship}>{profile.emergencyContactRelationship || "Vinculo pendiente"}</Text>
      </AppCard>

      {isDriver && driverProfile && (
        <AppCard>
          <View style={sharedStyles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={sharedStyles.sectionTitle}>Credenciales del conductor</Text>
              <Text style={sharedStyles.text}>{driverProfile.vehicleColor ? `${driverProfile.vehicleColor} - ` : ""}{driverProfile.vehicle}</Text>
              <Text style={sharedStyles.text}>Placa: {driverProfile.plate}</Text>
              <Text style={sharedStyles.text}>Licencia: {driverProfile.licenseNumber || "validada"}</Text>
            </View>
            <TrustScoreBadge score={driverProfile.trustScore} />
          </View>
          <VerificationChecklist compact />
        </AppCard>
      )}

      <AppCard>
        <Text style={sharedStyles.sectionTitle}>Estado operativo</Text>
        {activeTrip ? (
          <>
            <Text style={sharedStyles.text}>Tienes un viaje activo o finalizado pendiente de revisar.</Text>
            <AppButton title="Abrir viaje" icon="map-marker-path" onPress={onOpenActiveTrip} />
          </>
        ) : (
          <Text style={styles.emptyState}>No hay viajes activos en este momento.</Text>
        )}
        <AppButton title="Cerrar sesion" icon="logout" onPress={onLogout} variant="ghost" />
      </AppCard>
    </View>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  identityRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  identityCopy: { flex: 1 },
  flatStats: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  infoPill: { minWidth: 120, flex: 1, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 11 },
  infoLabel: { color: colors.textMuted, fontSize: 11, fontWeight: "900", textTransform: "uppercase", marginBottom: 4 },
  infoValue: { color: colors.text, fontWeight: "900" },
  relationship: { color: colors.secondaryDark, backgroundColor: colors.secondarySoft, borderRadius: 20, padding: 10, fontWeight: "900", overflow: "hidden" },
  emptyState: { backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 12, color: colors.textMuted, fontWeight: "800", lineHeight: 20 },
});
