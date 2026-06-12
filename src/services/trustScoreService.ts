export function calculateTrustScore({ rating, completedTrips, verified, cancellationRate }: { rating: number; completedTrips: number; verified: boolean; cancellationRate: number }) {
  const ratingScore = (rating / 5) * 38;
  const tripsScore = Math.min(completedTrips / 120, 1) * 24;
  const verificationScore = verified ? 23 : 0;
  const cancellationScore = Math.max(0, 1 - cancellationRate) * 15;
  return Math.round(ratingScore + tripsScore + verificationScore + cancellationScore);
}

export function getTripStatusLabel(status: string) {
  if (status === "driver_on_way") return "Conductor en camino";
  if (status === "in_progress") return "Viaje en curso";
  if (status === "completed") return "Viaje finalizado";
  if (status === "rated") return "Viaje calificado";
  if (status === "cancelled") return "Cancelado";
  return "Pendiente";
}
