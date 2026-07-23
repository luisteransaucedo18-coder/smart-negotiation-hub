import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import AppButton from "../components/AppButton";
import OnboardingMapCard, { OnboardingVisual } from "../components/OnboardingMapCard";
import SmartHubLogo from "../components/SmartHubLogo";
import { colors } from "../theme/colors";

type Props = {
  onContinue: () => void;
  saving?: boolean;
};

const slides: { visual: OnboardingVisual; title: string; subtitle: string; button: string }[] = [
  {
    visual: "route",
    title: "Cada viaje, bajo tu control",
    subtitle: "Negocia tu tarifa, verifica al conductor y sigue tu ruta con seguridad en tiempo real.",
    button: "Continuar",
  },
  {
    visual: "driver",
    title: "Elige conductores verificados",
    subtitle: "Compara precio, placa, vehiculo y puntaje de confianza antes de aceptar una oferta.",
    button: "Continuar",
  },
  {
    visual: "savings",
    title: "Viaja seguro y paga lo justo",
    subtitle: "Mantén la tarifa protegida, comparte tu ruta y evita cobros sorpresa al finalizar.",
    button: "Empezar",
  },
];

export default function OnboardingScreen({ onContinue, saving = false }: Props) {
  const { width, height } = useWindowDimensions();
  const compact = width < 390 || height < 760;
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentSlide = slides[currentIndex];

  function handleNext() {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((value) => value + 1);
      return;
    }
    onContinue();
  }

  return (
    <View style={[styles.screen, compact && styles.compactScreen]}>
      <View style={styles.topBar}>
        <SmartHubLogo size={34} showText={false} />
        <TouchableOpacity activeOpacity={0.78} onPress={onContinue} style={styles.skipButton}>
          <Text style={styles.skipText}>Saltar</Text>
        </TouchableOpacity>
      </View>

      <OnboardingMapCard visual={currentSlide.visual} />

      <View style={[styles.copyBlock, compact && styles.compactCopyBlock]}>
        <Text style={[styles.title, compact && styles.compactTitle]}>{currentSlide.title}</Text>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>{currentSlide.subtitle}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${((currentIndex + 1) / slides.length) * 100}%` }]} />
      </View>

      <View style={styles.dots}>
        {slides.map((slide, index) => (
          <View key={slide.visual} style={[styles.dot, index === currentIndex && styles.activeDot]} />
        ))}
      </View>

      <AppButton title={currentSlide.button} icon="arrow-right" onPress={handleNext} loading={saving} style={styles.cta} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 26,
    justifyContent: "space-between",
  },
  compactScreen: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 18,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skipButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    color: colors.textMuted,
    fontWeight: "800",
    fontSize: 13,
  },
  copyBlock: {
    marginTop: 4,
  },
  compactCopyBlock: {
    marginTop: 0,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 39,
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 26,
    lineHeight: 31,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  compactSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressTrack: {
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: "hidden",
    marginTop: 16,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.ink,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    marginTop: 14,
    marginBottom: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.ink,
  },
  cta: {
    backgroundColor: colors.ink,
    marginTop: 10,
  },
});
