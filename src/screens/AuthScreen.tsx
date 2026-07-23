import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import AppButton from "../components/AppButton";
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
  keyboardVisible?: boolean;
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
  const [passwordVisible, setPasswordVisible] = useState(false);
  const register = props.authMode === "register";
  const normalizedPlate = props.plate.trim().toUpperCase();
  const { height, width } = useWindowDimensions();
  const compactLogin = !register && (height < 900 || width <= 480);
  const editingLogin = !register && !!props.keyboardVisible;
  const loginDisabled = !register && (!isValidEmail(props.email) || !isValidPassword(props.password));

  return (
    <View style={[styles.screen, !register && !editingLogin && !compactLogin && styles.loginScreen, (!register && compactLogin) && styles.compactLoginScreen, editingLogin && styles.editingLoginScreen]}>
      {!editingLogin && <View style={[styles.brandCard, compactLogin && styles.compactBrandCard]}>
        <View style={styles.brandRow}>
          <SmartHubLogo showText={false} size={compactLogin ? 36 : 42} />
          <View>
            <Text style={styles.brandName}>SmartHub</Text>
          <Text style={styles.brandTagline}>viajes negociados</Text>
          </View>
        </View>
        <View style={[styles.secureBadge, compactLogin && styles.compactSecureBadge]}>
          <MaterialCommunityIcons name="shield-check-outline" size={15} color={colors.secondaryDark} />
          <Text style={styles.secureText}>Tarifa protegida</Text>
        </View>
      </View>}

      {!editingLogin && <View style={[styles.heroBlock, !register && styles.loginHeroBlock, compactLogin && styles.compactHeroBlock]}>
        {register && <View style={styles.logo}><SmartHubLogo showText={false} size={66} /></View>}
        <Text style={[styles.title, !register && styles.welcomeTitle, compactLogin && styles.compactTitle]}>{register ? "Crear cuenta" : "Bienvenido a SmartHub"}</Text>
        {register && <Text style={[styles.subtitle, compactLogin && styles.compactSubtitle]}>Configura tu perfil para activar negociacion, confianza y seguridad en tus viajes.</Text>}
      </View>}

      <View style={[styles.formCard, compactLogin && styles.compactFormCard, editingLogin && styles.editingFormCard]}>
        <View style={[styles.formHeader, compactLogin && styles.compactFormHeader, editingLogin && styles.editingFormHeader]}>
          <Text style={styles.formTitle}>{register ? "Datos de acceso" : "Acceso seguro"}</Text>
          {!editingLogin && !(compactLogin && !register) && <Text style={styles.formHint}>{register ? "Completa la informacion necesaria." : "Selecciona tu rol e ingresa tus credenciales."}</Text>}
        </View>

        <Text style={styles.label}>Tipo de usuario</Text>
        <View style={[styles.roleRow, editingLogin && styles.editingRoleRow]}>
          <TouchableOpacity style={[styles.roleButton, editingLogin && styles.editingRoleButton, props.role === "passenger" && styles.activeRole]} onPress={() => props.setRole("passenger")}>
            <MaterialCommunityIcons name="account-outline" size={18} color={props.role === "passenger" ? "#FFFFFF" : colors.textMuted} />
            <Text style={[styles.roleText, props.role === "passenger" && styles.activeText]}>Pasajero</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.roleButton, editingLogin && styles.editingRoleButton, props.role === "driver" && styles.activeRole]} onPress={() => props.setRole("driver")}>
            <MaterialCommunityIcons name="steering" size={18} color={props.role === "driver" ? "#FFFFFF" : colors.textMuted} />
            <Text style={[styles.roleText, props.role === "driver" && styles.activeText]}>Conductor</Text>
          </TouchableOpacity>
        </View>
        {!register && !editingLogin && !compactLogin && <Text style={sharedStyles.fieldHelp}>Si tu cuenta existe en Auth pero no tiene perfil en Firestore, este rol ayuda a reconstruirlo.</Text>}

        {register && (
          <>
            <Text style={styles.label}>Nombre y apellido</Text>
            <TextInput
              style={styles.input}
              value={props.name}
              onChangeText={props.setName}
              placeholder="Ejemplo: Luis Teran"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <FieldFeedback value={props.name} ok={isValidFullName(props.name)} message="Ingresa minimo un nombre y un apellido." success="Nombre completo valido" />

            <Text style={styles.label}>DNI</Text>
            <TextInput
              style={styles.input}
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

                <Text style={styles.label}>Vehiculo</Text>
                <TextInput style={styles.input} value={props.vehicle} onChangeText={props.setVehicle} placeholder="Toyota Yaris" returnKeyType="next" />
                <FieldFeedback value={props.vehicle} ok={props.vehicle.trim().length >= 3} message="Ingresa el modelo del vehiculo." success="Modelo registrado" />

                <Text style={styles.label}>Color del vehiculo</Text>
                <TextInput style={styles.input} value={props.vehicleColor} onChangeText={props.setVehicleColor} placeholder="Blanco" returnKeyType="next" />
                <FieldFeedback value={props.vehicleColor} ok={props.vehicleColor.trim().length >= 3} message="Ingresa el color del vehiculo." success="Color valido" />

                <Text style={styles.label}>Placa</Text>
                <TextInput style={styles.input} value={props.plate} onChangeText={(value) => props.setPlate(value.toUpperCase())} placeholder="ABC-123" autoCapitalize="characters" returnKeyType="next" />
                <FieldFeedback value={props.plate} ok={isValidPlate(normalizedPlate)} message="Formato sugerido: ABC-123 o ABC123." success="Placa valida" />

                <Text style={styles.label}>Licencia de conducir</Text>
                <TextInput style={styles.input} value={props.licenseNumber} onChangeText={(value) => props.setLicenseNumber(value.toUpperCase())} placeholder="Numero de licencia" autoCapitalize="characters" returnKeyType="next" />
                <FieldFeedback value={props.licenseNumber} ok={isValidLicense(props.licenseNumber)} message="Ingresa minimo 6 caracteres." success="Licencia registrada" />
              </>
            )}

            <Text style={styles.label}>Contacto de emergencia</Text>
            <TextInput style={styles.input} value={props.emergencyContactName} onChangeText={props.setEmergencyContactName} placeholder="Nombre y apellido" autoCapitalize="words" returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactName} ok={isValidFullName(props.emergencyContactName)} message="Ingresa nombre y apellido del contacto." success="Contacto valido" />

            <Text style={styles.label}>Telefono del contacto</Text>
            <TextInput style={styles.input} value={props.emergencyContactPhone} onChangeText={(value) => cleanNumeric(value, props.setEmergencyContactPhone, 9)} placeholder="999888777" keyboardType="phone-pad" maxLength={9} returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactPhone} ok={isValidPhone(props.emergencyContactPhone)} message="Debe tener 9 digitos y empezar con 9." success="Telefono valido" />

            <Text style={styles.label}>Parentesco</Text>
            <TextInput style={styles.input} value={props.emergencyContactRelationship} onChangeText={props.setEmergencyContactRelationship} placeholder="Madre, hermano, amiga..." returnKeyType="next" />
            <FieldFeedback value={props.emergencyContactRelationship} ok={props.emergencyContactRelationship.trim().length >= 3} message="Indica el parentesco o vinculo." success="Parentesco valido" />
          </>
        )}

        <Text style={styles.label}>Correo</Text>
        <TextInput style={[styles.input, editingLogin && styles.editingInput]} value={props.email} onChangeText={props.setEmail} placeholder="correo@test.com" keyboardType="email-address" autoCapitalize="none" returnKeyType="next" />
        {(!editingLogin || !!props.email.trim()) && !(compactLogin && !props.email.trim()) && <FieldFeedback value={props.email} ok={isValidEmail(props.email)} message="Ingresa un correo valido." success="Correo valido" />}

        <Text style={styles.label}>Contrasena</Text>
        <View style={[styles.passwordField, editingLogin && styles.editingPasswordField]}>
          <TextInput
            style={[styles.passwordInput, editingLogin && styles.editingPasswordInput]}
            value={props.password}
            onChangeText={props.setPassword}
            placeholder="Minimo 6 caracteres"
            secureTextEntry={!passwordVisible}
            returnKeyType="done"
          />
          <TouchableOpacity
            activeOpacity={0.78}
            accessibilityRole="button"
            accessibilityLabel={passwordVisible ? "Ocultar contrasena" : "Mostrar contrasena"}
            style={styles.eyeButton}
            onPress={() => setPasswordVisible((value) => !value)}
          >
            <MaterialCommunityIcons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={21} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        {(!editingLogin || !!props.password.trim()) && !(compactLogin && !props.password.trim()) && <FieldFeedback value={props.password} ok={isValidPassword(props.password)} message="La contrasena debe tener minimo 6 caracteres." success="Contrasena valida" />}

        {!!props.authError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>No se pudo continuar</Text>
            <Text style={styles.errorText}>{props.authError}</Text>
            {!register && <Text style={styles.errorHint}>Si aun no registraste este correo, toca Crear cuenta nueva y crea primero el usuario.</Text>}
          </View>
        )}

        <AppButton title={register ? "Crear cuenta" : "Ingresar"} icon={register ? "account-plus-outline" : "login"} onPress={props.onSubmit} loading={props.saving} disabled={loginDisabled} style={styles.primaryButton} />
        <AppButton title={register ? "Ya tengo cuenta" : "Crear cuenta nueva"} icon="account-switch-outline" onPress={() => props.setAuthMode(register ? "login" : "register")} variant="ghost" />
        {register && <AppButton title="Volver al login" icon="arrow-left" onPress={props.onBack} variant="ghost" />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { width: "100%", maxWidth: 560, alignSelf: "center" },
  loginScreen: { flex: 1, justifyContent: "center" },
  compactLoginScreen: { flex: 1, justifyContent: "flex-start" },
  editingLoginScreen: { flex: 1, justifyContent: "flex-start", paddingTop: 0 },
  brandCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 14, marginBottom: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" },
  compactBrandCard: { marginBottom: 10, padding: 9 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, flexShrink: 1 },
  brandName: { color: colors.text, fontSize: 19, fontWeight: "900" },
  brandTagline: { color: colors.textMuted, fontSize: 12, fontWeight: "700", marginTop: 1 },
  secureBadge: { backgroundColor: colors.secondarySoft, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7, flexDirection: "row", alignItems: "center", gap: 5 },
  compactSecureBadge: { paddingHorizontal: 9, paddingVertical: 6 },
  secureText: { color: colors.secondaryDark, fontWeight: "800", fontSize: 11 },
  heroBlock: { alignItems: "center", marginBottom: 18 },
  loginHeroBlock: { alignItems: "flex-start", marginBottom: 16 },
  compactHeroBlock: { marginBottom: 10 },
  logo: { alignItems: "center", marginBottom: 10 },
  title: { color: colors.text, fontSize: 30, fontWeight: "900", lineHeight: 36, textAlign: "center" },
  welcomeTitle: { fontSize: 27, lineHeight: 32, textAlign: "left" },
  compactTitle: { fontSize: 24, lineHeight: 29, textAlign: "left" },
  subtitle: { color: colors.textMuted, lineHeight: 22, textAlign: "center", marginTop: 8, maxWidth: 430 },
  compactSubtitle: { fontSize: 13, lineHeight: 19, marginTop: 4, textAlign: "left" },
  formCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 20, padding: 18, marginBottom: 18 },
  compactFormCard: { padding: 13, marginBottom: 0 },
  editingFormCard: { padding: 13, marginBottom: 0 },
  formHeader: { marginBottom: 16 },
  compactFormHeader: { marginBottom: 8 },
  editingFormHeader: { marginBottom: 10 },
  formTitle: { color: colors.text, fontSize: 19, fontWeight: "900", marginBottom: 4 },
  formHint: { color: colors.textMuted, lineHeight: 20, fontWeight: "700" },
  label: { ...sharedStyles.label, color: colors.text, marginTop: 2 },
  input: { ...sharedStyles.input, borderRadius: 20, borderWidth: 1.5, minHeight: 52, paddingHorizontal: 16, backgroundColor: "#FBFCFE" },
  editingInput: { minHeight: 46, paddingVertical: 9, marginBottom: 6 },
  passwordField: { flexDirection: "row", alignItems: "center", borderRadius: 20, borderWidth: 1.5, borderColor: colors.border, minHeight: 52, paddingLeft: 16, paddingRight: 6, marginBottom: 8, backgroundColor: "#FBFCFE" },
  editingPasswordField: { minHeight: 46, marginBottom: 6 },
  passwordInput: { flex: 1, minHeight: 48, color: colors.text, fontSize: 16, paddingVertical: 10, paddingRight: 8 },
  editingPasswordInput: { minHeight: 42, paddingVertical: 8 },
  eyeButton: { width: 44, height: 44, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  editingRoleRow: { marginBottom: 10 },
  roleButton: { flex: 1, backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 11, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  editingRoleButton: { paddingVertical: 10 },
  activeRole: { backgroundColor: colors.ink, borderColor: colors.ink },
  roleText: { color: colors.textMuted, fontWeight: "900" },
  activeText: { color: "#FFFFFF" },
  infoBox: { backgroundColor: colors.primarySoft, borderRadius: 20, padding: 12, marginBottom: 14 },
  infoText: { color: colors.primaryDark, fontWeight: "800", lineHeight: 20 },
  errorBox: { backgroundColor: colors.dangerSoft, borderWidth: 1.5, borderColor: "#FCA5A5", borderRadius: 20, padding: 12, marginBottom: 12 },
  errorTitle: { color: "#991B1B", fontWeight: "900", marginBottom: 3 },
  errorText: { color: "#7F1D1D", lineHeight: 19, fontWeight: "700" },
  errorHint: { color: "#7F1D1D", lineHeight: 18, marginTop: 5 },
  primaryButton: { borderRadius: 20 },
});
