export function toNumber(value: string, fallback: number) {
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function calculateSuggestedPrice(distanceKm: number, isPeakHour: boolean, safeNightMode = false) {
  const baseFare = 4;
  const pricePerKm = 1.25;
  let price = baseFare + distanceKm * pricePerKm;
  if (isPeakHour) price *= 1.15;
  if (safeNightMode) price *= 1.1;
  return Number(Math.max(price, 6).toFixed(2));
}

export function calculatePriceRange(suggestedPrice: number) {
  return {
    min: Number((suggestedPrice * 0.9).toFixed(2)),
    max: Number((suggestedPrice * 1.18).toFixed(2)),
  };
}

export function getOfferRecommendation(offeredPrice: number, trustScore: number, suggestedPrice: number) {
  if (trustScore >= 88 && offeredPrice <= suggestedPrice * 1.15) return "Recomendado";
  if (trustScore >= 75) return "Seguro";
  if (offeredPrice < suggestedPrice * 0.85) return "Revisar precio bajo";
  return "Comparar";
}
