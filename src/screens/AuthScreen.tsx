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
  authError: string;
  onSubmit: () => void; onBack: () => void; saving: boolean;
};

function FieldFeedback({ value, ok, message, success }: { value: string; ok: boolean; message: string; success?: string }) {
  if (!value.trim()) return <Text style={sharedStyles.fieldHelp}>{message}</Text>;
  if (ok) return <Text style={sharedStyles.fieldOk}>{success || "Dato valido"}</Text>;
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
      <Text style={sharedStyles.title}>{register ? "Crear cuenta SmartHub" : "Ingresar"}</Text>
      <Text style={sharedStyles.subtitle}>{register ? "Elige pasajero o conductor. El prototipo usa esta informacion para activar precio protegido, confianza y seguridad." : "Accede a tu cuenta para continuar tu viaje protegido."}</Text>

      <AppCard>
        <Text style={sharedStyles.label}>Tipo de usuario</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity style={[styles.roleButton, props.role === "passenger" && styles.activeRole]} onPress={() => props.setRole("passenger")}><Text style={[styles.roleText, props.role === "passenger" && styles.activeText]}>Pasajero</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.roleButton, props.role === "driver" && styles.activeRole]} onPress={() => props.setRole("driver")}><Text style={[styles.roleText, props.role === "driver" && styles.activeText]}>Conductor</Text></TouchableOpacity>
        </View>
        {!register && <Text style={sharedStyles.fieldHelp}>Si tu cuenta existe en Auth pero no tiene perfil en Firestore, este rol ayuda a reconstruirlo.</Text>}

        {register && (
          <>
            <Text style={sharedStyles.label}>Nombre y apellido</Text>
            <TextInput
              style={sharedStyles.input}
              value={props.name}
              onChangeText={props.setName}
              placeholder="Ejemplo: Luis Teran"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <FieldFeedback value={props.name} ok={isValidFullName(props.name)} message="Ingresa minimo un nombre y un apellido." success="Nombre completo valido" />

            <Text style={sharedStyles.label}>DNI</Text>
            <TextInput
              style={sharedStyles.input}
              value={props.dni}
              onChangeText={(value) => cleanNumeric(value, props.setDni, 8)}
              placeholder="8 digitos"
              keyboardType="number-pad"
              maxLength={8}
              returnKeyType="next"
            />
            <FieldFeedback value={props.dni} ok={isValidDni(props.dni)} message="El DNI debe tener exactamente 8 digitos." success="DNI valido" />

            {props.role === "driver" && (
              <>
                <View style={styles.infoBox}><Text style={styles.infoText}>Perfil verificado: estos datos alimentan placa visible, licencia, filtro de confianza y penalizacion por cancelaciones.</Text></View>

                <Text style={sharedStyles.label}>Vehiculo</Text>
                <TextInput style={sharedStyles.input} value={props.vehicle} onChangeText={props.setVehicle} placeholder="Toyota Yaris" returnKeyType="next" />
                <FieldFeedback value={props.vehicle} ok={props.vehicle.trim().length >= 3} message="Ingresa el modelo del vehiculo." success="Modelo registrado" />

                <Text style={sharedStyles.label}>Color del vehiculo</Text>
                <TextInput style={sharedStyles.input} value={props.vehicleColor} onChangeText={props.setVehicleColor} placeholder="Blanco" returnKeyType="next" />
                <FieldFeedback value={props.vehicleColor} ok={props.vehicleColor.trim().length >= 3} message="Ingresa el color del vehiculo." success="Color valido" />

                <Text style={sharedStyles.label}>Placa</Text>
                <TextInput style={sharedStyles.input} value={props.plate} onChangeText={(value) => props.setPlate(value.toUpperCase())} placeholder="ABC-123" autoCapitalize="characters" returnKeyType="next" />
                <FieldFeedback value={props.plate} ok={isValidPlate(normalizedPlate)} message="Formato sugerido: ABC-123 o ABC123." success="Placa valida" />

                <Text style={sharedStyles.label}>Licencia de conducir</Text>
                <TextInput style={sharedStyles.input} value={props.licenseNumber} onChangeText={(value) => props.setLicenseNumber(value.toUpperCase())} placeholder="Numero de licencia" autoCapitalize="characters" returnKeyType="next" />
                <FieldFeedback value={props.licenseNumber} ok={isValidLicense(props.licenseNumber)} message="Ingresa minimo 6 caracteres." success="Licencia registrada" />
              </>
            )}

            <Text style={sharedStyles.label}>Contacto de emergencia</Text>
            <TextInput style={sharedStyles.input} value={props.emergencyContactName} onChangeText={props.setEmergencyContactName} placeholder="Nombre y apellido" autoCapitalize="words" returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactName} ok={isValidFullName(props.emergencyContactName)} message="Ingresa nombre y apellido del contacto." success="Contacto valido" />

            <Text style={sharedStyles.label}>Telefono del contacto</Text>
            <TextInput style={sharedStyles.input} value={props.emergencyContactPhone} onChangeText={(value) => cleanNumeric(value, props.setEmergencyContactPhone, 9)} placeholder="999888777" keyboardType="phone-pad" maxLength={9} returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactPhone} ok={isValidPhone(props.emergencyContactPhone)} message="Debe tener 9 digitos y empezar con 9." success="Telefono valido" />

            <Text style={sharedStyles.label}>Parentesco</Text>
            <TextInput style={sharedStyles.input} value={props.emergencyContactRelationship} onChangeText={props.setEmergencyContactRelationship} placeholder="Madre, hermano, amiga..." returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactRelationship} ok={props.emergencyContactRelationship.trim().length >= 3} message="Indica el parentesco o vinculo." success="Parentesco valido" />
          </>
        )}

        <Text style={sharedStyles.label}>Correo</Text>
        <TextInput style={sharedStyles.input} value={props.email} onChangeText={props.setEmail} placeholder="correo@test.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
        <FieldFeedback value={props.email} ok={isValidEmail(props.email)} message="Ingresa un correo valido." success="Correo valido" />

        <Text style={sharedStyles.label}>Contrasena</Text>
        <TextInput style={sharedStyles.input} value={props.password} onChangeText={props.setPassword} placeholder="Minimo 6 caracteres" secureTextEntry returnKeyType="done" />
        <FieldFeedback value={props.password} ok={isValidPassword(props.password)} message="La contrasena debe tener minimo 6 caracteres." success="Contrasena valida" />

        {!!props.authError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>No se pudo continuar</Text>
            <Text style={styles.errorText}>{props.authError}</Text>
            {!register && <Text style={styles.errorHint}>Si aun no registraste este correo, toca Crear cuenta nueva y crea primero el usuario.</Text>}
          </View>
        )}

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
  errorBox: { backgroundColor: colors.dangerSoft, borderWidth: 1, borderColor: "#FCA5A5", borderRadius: 14, padding: 12, marginBottom: 12 },
  errorTitle: { color: "#991B1B", fontWeight: "900", marginBottom: 3 },
  errorText: { color: "#7F1D1D", lineHeight: 19, fontWeight: "700" },
  errorHint: { color: "#7F1D1D", lineHeight: 18, marginTop: 5 },
});
