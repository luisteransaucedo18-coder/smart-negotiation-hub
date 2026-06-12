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
      <Text style={sharedStyles.subtitle}>Tu opinión ayuda a mejorar el puntaje de confianza del conductor.</Text>
      <AppCard>
        <Text style={sharedStyles.sectionTitle}>{trip.driverName}</Text>
        <Text style={sharedStyles.text}>{trip.vehicle} · {trip.plate}</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}><Text style={styles.star}>{star <= rating ? "★" : "☆"}</Text></TouchableOpacity>
          ))}
        </View>
        <Text style={sharedStyles.fieldOk}>Calificación seleccionada: {rating}/5</Text>
        <Text style={sharedStyles.label}>Comentario opcional</Text>
        <TextInput
          style={[sharedStyles.input, styles.comment]}
          value={comment}
          onChangeText={setComment}
          placeholder="Ejemplo: Llegó puntual y respetó la tarifa"
          multiline
          maxLength={160}
          textAlignVertical="top"
          returnKeyType="done"
        />
        <Text style={commentLength > 145 ? sharedStyles.fieldError : sharedStyles.fieldHelp}>{commentLength}/160 caracteres.</Text>
        <AppButton title="Enviar calificación" onPress={onSubmit} loading={saving} />
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  starsRow: { flexDirection: "row", marginVertical: 18 },
  star: { fontSize: 42, color: colors.warning, marginRight: 8 },
  comment: { minHeight: 102, textAlignVertical: "top" },
});
