import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import { Trip, UserProfile } from "../types";

export async function createEmergencyAlert(trip: Trip, actor: UserProfile) {
  const actorLabel = actor.role === "passenger" ? "pasajero" : "conductor";
  const counterpartLabel = actor.role === "passenger" ? "conductor" : "pasajero";
  await addDoc(collection(db, "emergency_alerts"), {
    tripId: trip.id,
    activatedByUserId: actor.id,
    activatedByName: actor.name,
    activatedByRole: actor.role,
    emergencyContactName: actor.emergencyContactName || "No registrado",
    emergencyContactPhone: actor.emergencyContactPhone || "No registrado",
    emergencyContactRelationship: actor.emergencyContactRelationship || "No registrado",
    passengerId: trip.passengerId,
    passengerName: trip.passengerName,
    driverId: trip.driverId,
    driverName: trip.driverName,
    plate: trip.plate,
    vehicle: trip.vehicle,
    vehicleColor: trip.vehicleColor || "",
    finalPrice: trip.finalPrice,
    originName: trip.originName,
    destinationName: trip.destinationName,
    originLat: trip.originLat,
    originLng: trip.originLng,
    destinationLat: trip.destinationLat,
    destinationLng: trip.destinationLng,
    currentTripStatus: trip.status,
    message: `Alerta activada por el ${actorLabel}. Se preparan datos del ${counterpartLabel}, ruta, tarifa pactada y contacto de emergencia.`,
    status: "sent_simulated",
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, "trips", trip.id), { emergencyStatus: "active", lastEmergencyByRole: actor.role, lastEmergencyByName: actor.name, lastEmergencyAt: serverTimestamp() });
}
