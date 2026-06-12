import { addDoc, collection, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { DriverProfile, Offer, RideRequest } from "../types";
import { getOfferRecommendation } from "./pricingService";

export async function createOffer({ ride, driver, offeredPrice }: { ride: RideRequest; driver: DriverProfile; offeredPrice: number }) {
  await addDoc(collection(db, "offers"), {
    rideRequestId: ride.id,
    driverId: driver.id,
    driverName: driver.name,
    vehicle: driver.vehicle,
    vehicleColor: driver.vehicleColor || "",
    plate: driver.plate,
    rating: driver.rating,
    completedTrips: driver.completedTrips,
    verified: driver.verified,
    trustScore: driver.trustScore,
    offeredPrice,
    recommendationLabel: getOfferRecommendation(offeredPrice, driver.trustScore, ride.suggestedPrice),
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export function listenOffersByRide(rideRequestId: string, callback: (offers: Offer[]) => void) {
  const q = query(collection(db, "offers"), where("rideRequestId", "==", rideRequestId), where("status", "==", "pending"));
  return onSnapshot(q, (snapshot) => {
    const offers = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Offer[];
    callback(offers.sort((a, b) => b.trustScore - a.trustScore || a.offeredPrice - b.offeredPrice));
  });
}

export async function markOfferAccepted(offerId: string) { await updateDoc(doc(db, "offers", offerId), { status: "accepted" }); }
export async function rejectOffer(offerId: string) { await updateDoc(doc(db, "offers", offerId), { status: "rejected" }); }
