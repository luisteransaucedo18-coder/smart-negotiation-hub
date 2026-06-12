import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { RideRequest, UserProfile } from "../types";

export const DEFAULT_ORIGIN = { name: "Universidad UTP", latitude: -8.1116, longitude: -79.0287 };
export const DEFAULT_DESTINATION = { name: "Mall Aventura", latitude: -8.1025, longitude: -79.0369 };

export async function createRideRequest({ profile, originName, destinationName, distanceKm, suggestedPrice, minRecommendedPrice, maxRecommendedPrice, passengerPrice, originLat, originLng, destinationLat, destinationLng, safeNightMode, quietMode, passengerNote }: {
  profile: UserProfile; originName: string; destinationName: string; distanceKm: number; suggestedPrice: number; minRecommendedPrice: number; maxRecommendedPrice: number; passengerPrice: number; originLat: number; originLng: number; destinationLat: number; destinationLng: number; safeNightMode: boolean; quietMode: boolean; passengerNote: string;
}) {
  const data = {
    passengerId: profile.id,
    passengerName: profile.name,
    originName,
    destinationName,
    distanceKm,
    suggestedPrice,
    minRecommendedPrice,
    maxRecommendedPrice,
    passengerPrice,
    status: "pending",
    paymentMethod: "cash" as const,
    originLat,
    originLng,
    destinationLat,
    destinationLng,
    safeNightMode,
    quietMode,
    passengerNote,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, "ride_requests"), data);
  return { id: ref.id, ...data } as RideRequest;
}

export function listenPendingRides(callback: (rides: RideRequest[]) => void) {
  const q = query(collection(db, "ride_requests"), where("status", "==", "pending"));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as RideRequest[]));
}

export function listenPassengerPendingRide(passengerId: string, callback: (ride: RideRequest | null) => void) {
  const q = query(collection(db, "ride_requests"), where("passengerId", "==", passengerId), where("status", "==", "pending"));
  return onSnapshot(q, (snapshot) => {
    if (snapshot.empty) return callback(null);
    callback({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as RideRequest);
  });
}

export async function cancelRideByDriverSimulated(rideId: string) {
  await updateDoc(doc(db, "ride_requests", rideId), { status: "cancelled_by_driver_simulated" });
}
