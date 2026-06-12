import { addDoc, collection, doc, getDoc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Offer, RideRequest, Trip, TripStatus, UserProfile } from "../types";
import { markOfferAccepted } from "./offerService";

export async function acceptOfferAndCreateTrip({ profile, ride, offer }: { profile: UserProfile; ride: RideRequest; offer: Offer }) {
  await updateDoc(doc(db, "ride_requests", ride.id), { status: "accepted", acceptedOfferId: offer.id, acceptedDriverId: offer.driverId, finalPrice: offer.offeredPrice });
  await markOfferAccepted(offer.id);
  const data = {
    rideRequestId: ride.id,
    passengerId: profile.id,
    passengerName: profile.name,
    driverId: offer.driverId,
    driverName: offer.driverName,
    vehicle: offer.vehicle,
    vehicleColor: offer.vehicleColor || "",
    plate: offer.plate,
    trustScore: offer.trustScore,
    finalPrice: offer.offeredPrice,
    status: "driver_on_way" as TripStatus,
    originName: ride.originName,
    destinationName: ride.destinationName,
    originLat: ride.originLat,
    originLng: ride.originLng,
    destinationLat: ride.destinationLat,
    destinationLng: ride.destinationLng,
    paymentMethod: "cash" as const,
    safeNightMode: Boolean(ride.safeNightMode),
    quietMode: Boolean(ride.quietMode),
    passengerNote: ride.passengerNote || "",
    emergencyStatus: "none" as const,
    createdAt: serverTimestamp(),
  };
  const tripRef = await addDoc(collection(db, "trips"), data);
  return { id: tripRef.id, ...data } as Trip;
}

export function listenTrip(tripId: string, callback: (trip: Trip) => void) {
  return onSnapshot(doc(db, "trips", tripId), (snapshot) => {
    if (snapshot.exists()) callback({ id: snapshot.id, ...snapshot.data() } as Trip);
  });
}

const VISIBLE_TRIP_STATUSES: TripStatus[] = ["driver_on_way", "in_progress", "completed"];

function timestampToMillis(value: unknown) {
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}

function pickLatestVisibleTrip(trips: Trip[]) {
  const visibleTrips = trips.filter((trip) => VISIBLE_TRIP_STATUSES.includes(trip.status));
  if (visibleTrips.length === 0) return null;

  return visibleTrips.sort((a, b) => {
    const timeB = timestampToMillis(b.createdAt);
    const timeA = timestampToMillis(a.createdAt);
    return timeB - timeA;
  })[0];
}

export function listenDriverActiveTrip(driverId: string, callback: (trip: Trip | null) => void) {
  const q = query(collection(db, "trips"), where("driverId", "==", driverId));
  return onSnapshot(q, (snapshot) => {
    const trips = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Trip[];
    callback(pickLatestVisibleTrip(trips));
  });
}

export function listenPassengerActiveTrip(passengerId: string, callback: (trip: Trip | null) => void) {
  const q = query(collection(db, "trips"), where("passengerId", "==", passengerId));
  return onSnapshot(q, (snapshot) => {
    const trips = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Trip[];
    callback(pickLatestVisibleTrip(trips));
  });
}

export async function updateTripStatus(tripId: string, status: TripStatus) {
  await updateDoc(doc(db, "trips", tripId), { status });
}

export async function resolveEmergency(tripId: string) {
  await updateDoc(doc(db, "trips", tripId), { emergencyStatus: "resolved" });
}

export async function getRideRequest(rideId: string) {
  const snap = await getDoc(doc(db, "ride_requests", rideId));
  if (!snap.exists()) throw new Error("No se encontró la solicitud de viaje.");
  return { id: snap.id, ...snap.data() } as RideRequest;
}
