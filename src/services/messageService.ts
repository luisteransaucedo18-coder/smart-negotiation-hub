import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../services/firebase";
import { ChatMessage, Trip, UserProfile } from "../types";

export async function sendTripMessage(trip: Trip, actor: UserProfile, text: string) {
  await addDoc(collection(db, "ride_messages"), {
    tripId: trip.id,
    fromUserId: actor.id,
    fromName: actor.name,
    fromRole: actor.role,
    text,
    createdAt: serverTimestamp(),
  });
}

export async function sendQuickMessage(trip: Trip, actor: UserProfile, text: string) {
  return sendTripMessage(trip, actor, text);
}

export function listenTripMessages(tripId: string, callback: (messages: ChatMessage[]) => void) {
  const q = query(collection(db, "ride_messages"), where("tripId", "==", tripId));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as ChatMessage[];
    callback(messages.sort((a, b) => timestampToMillis(a.createdAt) - timestampToMillis(b.createdAt)));
  });
}

function timestampToMillis(value: unknown) {
  if (value && typeof value === "object" && "toMillis" in value && typeof (value as { toMillis: () => number }).toMillis === "function") {
    return (value as { toMillis: () => number }).toMillis();
  }
  return 0;
}
