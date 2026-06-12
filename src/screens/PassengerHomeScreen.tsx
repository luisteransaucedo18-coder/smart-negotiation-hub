import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import PriceCard from "../components/PriceCard";
import ToggleChip from "../components/ToggleChip";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";
import { RoutePoint } from "../types";
import { toNumber } from "../services/pricingService";
import { validatePrice } from "../services/validationService";

type Props = {
  originPoint: RoutePoint;
  destinationPoint: RoutePoint;
  onPickOrigin: () => void;
  onPickDestination: () => void;
  distanceKm: string;
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  passengerPrice: string;
  setPassengerPrice: (value: string) => void;
  passengerNote: string;
  setPassengerNote: (value: string) => void;
  isPeakHour: boolean;
  setIsPeakHour: (value: boolean) => void;
  safeNightMode: boolean;
  setSafeNightMode: (value: boolean) => void;
  quietMode: boolean;
  setQuietMode: (value: boolean) => void;
  onCreateRide: () => void;
  saving: boolean;
};

export default function PassengerHomeScreen({ originPoint, destinationPoint, onPickOrigin, onPickDestination, distanceKm, suggestedPrice, minPrice, maxPrice, passengerPrice, setPassengerPrice, passengerNote, setPassengerNote, isPeakHour, setIsPeakHour, safeNightMode, setSafeNightMode, quietMode, setQuietMode, onCreateRide, saving }: Props) {
  const proposedPrice = toNumber(passengerPrice, suggestedPrice);
  const priceError = passengerPrice.trim() ? validatePrice(proposedPrice, minPrice, maxPrice) : "Ingresa la tarifa que deseas proponer.";
  const noteLength = passengerNote.length;

  return (
    <View>
      <Text style={sharedStyles.title}>Solicitar viaje</Text>
      <Text style={sharedStyles.subtitle}>Elige origen y destino, revisa el rango recomendado y negocia una tarifa transparente.</Text>
      <AppCard>
        <LocationSummary title="Origen" point={originPoint} onPress={onPickOrigin} />
        <LocationSummary title="Destino" point={destinationPoint} onPress={onPickDestination} />
        <View style={styles.chipsWrap}>
          <ToggleChip label="Hora punta" active={isPeakHour} onPress={() => setIsPeakHour(!isPeakHour)} />
          <ToggleChip label="Viaje seguro nocturno" active={safeNightMode} onPress={() => setSafeNightMode(!safeNightMode)} />
          <ToggleChip label="Modo silencioso" active={quietMode} onPress={() => setQuietMode(!quietMode)} />
        </View>
        <PriceCard suggestedPrice={suggestedPrice} minPrice={minPrice} maxPrice={maxPrice} distanceKm={distanceKm} isPeakHour={isPeakHour} safeNightMode={safeNightMode} />
        <Text style={sharedStyles.label}>Tarifa que propones</Text>
        <TextInput
          style={[sharedStyles.input, priceError && passengerPrice.trim() ? styles.inputError : null]}
          value={passengerPrice}
          onChangeText={(value) => setPassengerPrice(value.replace(/[^0-9.,]/g, ""))}
          keyboardType="decimal-pad"
          placeholder="Ejemplo: 12.50"
          returnKeyType="done"
        />
        {priceError ? <Text style={sharedStyles.fieldError}>{priceError}</Text> : <Text style={sharedStyles.fieldOk}>Tarifa dentro del rango permitido.</Text>}

        <Text style={sharedStyles.label}>Nota breve para el conductor</Text>
        <TextInput
          style={[sharedStyles.input, styles.note]}
          value={passengerNote}
          onChangeText={setPassengerNote}
          placeholder="Ejemplo: Estoy en la puerta principal"
          multiline
          maxLength={120}
          textAlignVertical="top"
          returnKeyType="done"
        />
        <Text style={noteLength > 110 ? sharedStyles.fieldError : sharedStyles.fieldHelp}>{noteLength}/120 caracteres. Esta nota ayuda al conductor a ubicarte mejor.</Text>

        <View style={styles.lockBox}>
          <Text style={styles.lockTitle}>Tarifa pactada protegida</Text>
          <Text style={styles.lockText}>Cuando aceptes una oferta, la tarifa quedará visible y bloqueada durante el viaje.</Text>
        </View>
        <AppButton title="Solicitar viaje" onPress={onCreateRide} loading={saving} />
      </AppCard>
    </View>
  );
}

function LocationSummary({ title, point, onPress }: { title: string; point: RoutePoint; onPress: () => void }) {
  return (
    <View style={styles.locationBox}>
      <View style={{ flex: 1 }}>
        <Text style={styles.locationLabel}>{title}</Text>
        <Text style={styles.locationName}>{point.name}</Text>
        <Text style={styles.coords}>Punto elegido en el mapa</Text>
      </View>
      <TouchableOpacity style={styles.mapButton} onPress={onPress}><Text style={styles.mapText}>Elegir</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  locationBox: { flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: colors.surfaceSoft, borderWidth: 1, borderColor: colors.border, borderRadius: 18, padding: 14, marginBottom: 12 },
  locationLabel: { color: colors.textMuted, fontWeight: "800", fontSize: 12, marginBottom: 3 },
  locationName: { color: colors.text, fontWeight: "900", fontSize: 16 },
  coords: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  mapButton: { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999 },
  mapText: { color: "#FFFFFF", fontWeight: "900" },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", marginVertical: 4 },
  note: { minHeight: 88, textAlignVertical: "top" },
  inputError: { borderColor: colors.danger, backgroundColor: "#FFF7F7" },
  lockBox: { backgroundColor: colors.successSoft, padding: 13, borderRadius: 16, marginBottom: 8 },
  lockTitle: { color: colors.secondaryDark, fontWeight: "900", marginBottom: 3 },
  lockText: { color: colors.secondaryDark, lineHeight: 19 },
});
