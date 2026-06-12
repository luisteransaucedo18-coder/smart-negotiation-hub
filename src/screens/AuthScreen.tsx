import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import SmartHubLogo from "../components/SmartHubLogo";
import { AuthMode, Role } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { isValidDni, isValidEmail, isValidFullName, isValidLicense, isValidPassword, isValidPhone, isValidPlate } from "../services/validationService";

type Props = {
  authMode: AuthMode; setAuthMode: (mode: AuthMode) => void;
  name: string; setName: (value: string) => void; dni: string; setDni: (value: string) => void;
  email: string; setEmail: (value: string) => void; password: string; setPassword: (value: string) => void;
  role: Role; setRole: (value: Role) => void;
  vehicle: string; setVehicle: (value: string) => void; vehicleColor: string; setVehicleColor: (value: string) => void;
  plate: string; setPlate: (value: string) => void; licenseNumber: string; setLicenseNumber: (value: string) => void;
  emergencyContactName: string; setEmergencyContactName: (value: string) => void;
  emergencyContactPhone: string; setEmergencyContactPhone: (value: string) => void;
  emergencyContactRelationship: string; setEmergencyContactRelationship: (value: string) => void;
  onSubmit: () => void; onBack: () => void; saving: boolean;
};

function FieldFeedback({ value, ok, message, success }: { value: string; ok: boolean; message: string; success?: string }) {
  if (!value.trim()) return <Text style={sharedStyles.fieldHelp}>{message}</Text>;
  if (ok) return <Text style={sharedStyles.fieldOk}>{success || "Dato válido"}</Text>;
  return <Text style={sharedStyles.fieldError}>{message}</Text>;
}

function cleanNumeric(value: string, setter: (value: string) => void, maxLength?: number) {
  const onlyNumbers = value.replace(/\D/g, "").slice(0, maxLength || value.length);
  setter(onlyNumbers);
}

export default function AuthScreen(props: Props) {
  const register = props.authMode === "register";
  const normalizedPlate = props.plate.trim().toUpperCase();

  return (
    <View>
      <View style={styles.logo}><SmartHubLogo showText={false} size={58} /></View>
      <Text style={sharedStyles.title}>{register ? "Crear cuenta" : "Ingresar"}</Text>
      <Text style={sharedStyles.subtitle}>{register ? "Completa tus datos para activar seguridad, tarifa y contacto de emergencia." : "Accede a tu cuenta para continuar tu viaje."}</Text>

      <AppCard>
        {register && (
          <>
            <Text style={sharedStyles.label}>Nombre y apellido</Text>
            <TextInput
              style={sharedStyles.input}
              value={props.name}
              onChangeText={props.setName}
              placeholder="Ejemplo: Ana Torres"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <FieldFeedback value={props.name} ok={isValidFullName(props.name)} message="Ingresa mínimo un nombre y un apellido." success="Nombre completo válido" />

            <Text style={sharedStyles.label}>DNI</Text>
            <TextInput
              style={sharedStyles.input}
              value={props.dni}
              onChangeText={(value) => cleanNumeric(value, props.setDni, 8)}
              placeholder="8 dígitos"
              keyboardType="number-pad"
              maxLength={8}
              returnKeyType="next"
            />
            <FieldFeedback value={props.dni} ok={isValidDni(props.dni)} message="El DNI debe tener exactamente 8 dígitos." success="DNI válido" />

            <Text style={sharedStyles.label}>Tipo de usuario</Text>
            <View style={styles.roleRow}>
              <TouchableOpacity style={[styles.roleButton, props.role === "passenger" && styles.activeRole]} onPress={() => props.setRole("passenger")}><Text style={[styles.roleText, props.role === "passenger" && styles.activeText]}>Pasajero</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.roleButton, props.role === "driver" && styles.activeRole]} onPress={() => props.setRole("driver")}><Text style={[styles.roleText, props.role === "driver" && styles.activeText]}>Conductor</Text></TouchableOpacity>
            </View>

            {props.role === "driver" && (
              <>
                <Text style={sharedStyles.label}>Vehículo</Text>
                <TextInput style={sharedStyles.input} value={props.vehicle} onChangeText={props.setVehicle} placeholder="Toyota Yaris" returnKeyType="next" />
                <FieldFeedback value={props.vehicle} ok={props.vehicle.trim().length >= 3} message="Ingresa el modelo del vehículo." success="Modelo registrado" />

                <Text style={sharedStyles.label}>Color del vehículo</Text>
                <TextInput style={sharedStyles.input} value={props.vehicleColor} onChangeText={props.setVehicleColor} placeholder="Blanco" returnKeyType="next" />
                <FieldFeedback value={props.vehicleColor} ok={props.vehicleColor.trim().length >= 3} message="Ingresa el color del vehículo." success="Color válido" />

                <Text style={sharedStyles.label}>Placa</Text>
                <TextInput style={sharedStyles.input} value={props.plate} onChangeText={(value) => props.setPlate(value.toUpperCase())} placeholder="ABC-123" autoCapitalize="characters" returnKeyType="next" />
                <FieldFeedback value={props.plate} ok={isValidPlate(normalizedPlate)} message="Formato sugerido: ABC-123 o ABC123." success="Placa válida" />

                <Text style={sharedStyles.label}>Licencia de conducir</Text>
                <TextInput style={sharedStyles.input} value={props.licenseNumber} onChangeText={(value) => props.setLicenseNumber(value.toUpperCase())} placeholder="Número de licencia" autoCapitalize="characters" returnKeyType="next" />
                <FieldFeedback value={props.licenseNumber} ok={isValidLicense(props.licenseNumber)} message="Ingresa mínimo 6 caracteres." success="Licencia registrada" />

                <View style={styles.infoBox}><Text style={styles.infoText}>Estos datos alimentan el perfil verificado y el puntaje de confianza.</Text></View>
              </>
            )}

            <Text style={sharedStyles.label}>Contacto de emergencia</Text>
            <TextInput style={sharedStyles.input} value={props.emergencyContactName} onChangeText={props.setEmergencyContactName} placeholder="Nombre y apellido" autoCapitalize="words" returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactName} ok={isValidFullName(props.emergencyContactName)} message="Ingresa nombre y apellido del contacto." success="Contacto válido" />

            <Text style={sharedStyles.label}>Teléfono del contacto</Text>
            <TextInput style={sharedStyles.input} value={props.emergencyContactPhone} onChangeText={(value) => cleanNumeric(value, props.setEmergencyContactPhone, 9)} placeholder="999888777" keyboardType="phone-pad" maxLength={9} returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactPhone} ok={isValidPhone(props.emergencyContactPhone)} message="Debe tener 9 dígitos y empezar con 9." success="Teléfono válido" />

            <Text style={sharedStyles.label}>Parentesco</Text>
            <TextInput style={sharedStyles.input} value={props.emergencyContactRelationship} onChangeText={props.setEmergencyContactRelationship} placeholder="Madre, hermano, amiga..." returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactRelationship} ok={props.emergencyContactRelationship.trim().length >= 3} message="Indica el parentesco o vínculo." success="Parentesco válido" />
          </>
        )}

        <Text style={sharedStyles.label}>Correo</Text>
        <TextInput style={sharedStyles.input} value={props.email} onChangeText={props.setEmail} placeholder="correo@test.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
        <FieldFeedback value={props.email} ok={isValidEmail(props.email)} message="Ingresa un correo válido." success="Correo válido" />

        <Text style={sharedStyles.label}>Contraseña</Text>
        <TextInput style={sharedStyles.input} value={props.password} onChangeText={props.setPassword} placeholder="Mínimo 6 caracteres" secureTextEntry returnKeyType="done" />
        <FieldFeedback value={props.password} ok={isValidPassword(props.password)} message="La contraseña debe tener mínimo 6 caracteres." success="Contraseña válida" />

        <AppButton title={register ? "Crear cuenta" : "Ingresar"} onPress={props.onSubmit} loading={props.saving} />
        <AppButton title={register ? "Ya tengo cuenta" : "Crear cuenta nueva"} onPress={() => props.setAuthMode(register ? "login" : "register")} variant="ghost" />
        <AppButton title="Volver" onPress={props.onBack} variant="ghost" />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { alignItems: "center", marginTop: 10 },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  roleButton: { flex: 1, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 15, padding: 14, alignItems: "center" },
  activeRole: { backgroundColor: colors.primary, borderColor: colors.primary },
  roleText: { color: colors.textMuted, fontWeight: "900" },
  activeText: { color: "#FFFFFF" },
  infoBox: { backgroundColor: colors.primarySoft, borderRadius: 15, padding: 12, marginBottom: 14 },
  infoText: { color: colors.primaryDark, fontWeight: "800", lineHeight: 20 },
});
