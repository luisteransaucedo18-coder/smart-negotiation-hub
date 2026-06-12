import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Trip, UserProfile } from "../types";

export async function shareRouteSimulated(trip: Trip, actor: UserProfile) {
  await addDoc(collection(db, "route_shares"), {
    tripId: trip.id,
    sharedByUserId: actor.id,
    sharedByName: actor.name,
    emergencyContactName: actor.emergencyContactName || "No registrado",
    emergencyContactPhone: actor.emergencyContactPhone || "No registrado",
    originName: trip.originName,
    destinationName: trip.destinationName,
    finalPrice: trip.finalPrice,
    status: "shared_simulated",
    createdAt: serverTimestamp(),
  });
}
