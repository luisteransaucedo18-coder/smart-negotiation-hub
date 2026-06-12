import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import { Trip } from "../types";
import { colors } from "../theme/colors";
import { sharedStyles } from "../theme/sharedStyles";

type Props = { trip: Trip; rating: number; setRating: (value: number) => void; comment: string; setComment: (value: string) => void; onSubmit: () => void; saving: boolean };

export default function RatingScreen({ trip, rating, setRating, comment, setComment, onSubmit, saving }: Props) {
  const commentLength = comment.length;
  return (
    <View>
      <Text style={sharedStyles.title}>Calificar viaje</Text>
      <Text style={sharedStyles.subtitle}>Tu opinion alimenta el puntaje de confianza y ayuda a mantener conductores verificados.</Text>
      <AppCard>
        <View style={styles.summary}>
          <View style={styles.avatar}><Text style={styles.avatarText}>M</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={sharedStyles.sectionTitle}>{trip.driverName}</Text>
            <Text style={sharedStyles.text}>{trip.vehicle} - {trip.plate}</Text>
            <Text style={styles.price}>Precio protegido: S/ {trip.finalPrice.toFixed(2)}</Text>
          </View>
        </View>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
              <Text style={[styles.star, star <= rating && styles.starActive]}>{star <= rating ? "★" : "☆"}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={sharedStyles.fieldOk}>Calificacion seleccionada: {rating}/5</Text>
        <Text style={sharedStyles.label}>Comentario opcional</Text>
        <TextInput
          style={[sharedStyles.input, styles.comment]}
          value={comment}
          onChangeText={setComment}
          placeholder="Ejemplo: Llego puntual y respeto la tarifa pactada"
          multiline
          maxLength={160}
          textAlignVertical="top"
          returnKeyType="done"
        />
        <Text style={commentLength > 145 ? sharedStyles.fieldError : sharedStyles.fieldHelp}>{commentLength}/160 caracteres.</Text>
        <AppButton title="Enviar calificacion" onPress={onSubmit} loading={saving} />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { flexDirection: "row", gap: 12, alignItems: "center", marginBottom: 8 },
  avatar: { width: 54, height: 54, borderRadius: 12, backgroundColor: colors.primaryDark, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#FFFFFF", fontWeight: "900", fontSize: 20 },
  price: { color: colors.secondaryDark, fontWeight: "900" },
  starsRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 14, justifyContent: "space-between", gap: 8 },
  starButton: { flex: 1, minWidth: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: colors.surfaceSoft, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  star: { fontSize: 30, color: colors.textMuted },
  starActive: { color: colors.warning },
  comment: { minHeight: 102, textAlignVertical: "top" },
});
