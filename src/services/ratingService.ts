import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Trip, UserProfile } from "../types";
import { calculateTrustScore } from "./trustScoreService";

export async function submitTripRating({ trip, profile, rating, comment }: { trip: Trip; profile: UserProfile; rating: number; comment: string }) {
  await addDoc(collection(db, "ratings"), { tripId: trip.id, fromUserId: profile.id, toUserId: trip.driverId, stars: rating, comment: comment || "Calificación registrada", createdAt: serverTimestamp() });
  await updateDoc(doc(db, "trips", trip.id), { status: "rated" });
  try {
    const driverRef = doc(db, "drivers", trip.driverId);
    const driverSnap = await getDoc(driverRef);
    if (driverSnap.exists()) {
      const driver = driverSnap.data();
      const oldTrips = Number(driver.completedTrips || 0);
      const oldRating = Number(driver.rating || 5);
      const newCompletedTrips = oldTrips + 1;
      const newRating = Number(((oldRating * oldTrips + rating) / newCompletedTrips).toFixed(2));
      const newTrustScore = calculateTrustScore({ rating: newRating, completedTrips: newCompletedTrips, verified: Boolean(driver.verified), cancellationRate: Number(driver.cancellationRate || 0) });
      await updateDoc(driverRef, { rating: newRating, completedTrips: newCompletedTrips, trustScore: newTrustScore });
    }
  } catch {
    // La calificación ya quedó registrada. Si el perfil del conductor no se actualiza por reglas, no se bloquea el flujo.
  }
}
