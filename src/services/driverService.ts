import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { DriverProfile } from "../types";
import { calculateTrustScore } from "./trustScoreService";

export function listenDriverProfile(driverId: string, callback: (driver: DriverProfile | null) => void) {
  return onSnapshot(doc(db, "drivers", driverId), (snapshot) => {
    if (!snapshot.exists()) return callback(null);
    callback({ id: snapshot.id, ...snapshot.data() } as DriverProfile);
  });
}

export async function applySimulatedPenalty(driver: DriverProfile) {
  const newCancellationRate = Math.min(Number(driver.cancellationRate || 0) + 0.08, 1);
  const penaltyStatus = newCancellationRate >= 0.25 ? "restricted_simulated" : "warning_simulated";
  const newTrustScore = calculateTrustScore({ rating: driver.rating, completedTrips: driver.completedTrips, verified: driver.verified, cancellationRate: newCancellationRate });
  await updateDoc(doc(db, "drivers", driver.id), { cancellationRate: newCancellationRate, penaltyStatus, trustScore: newTrustScore });
}
