import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Trip, UserProfile } from "../types";

export async function sendQuickMessage(trip: Trip, actor: UserProfile, text: string) {
  await addDoc(collection(db, "ride_messages"), {
    tripId: trip.id,
    fromUserId: actor.id,
    fromName: actor.name,
    fromRole: actor.role,
    text,
    createdAt: serverTimestamp(),
  });
}
