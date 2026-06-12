import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { DriverProfile, Role, UserProfile } from "../types";
import { calculateTrustScore } from "./trustScoreService";

export async function registerUser({
  name, dni, email, password, role, vehicle, vehicleColor, plate, licenseNumber, emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
}: {
  name: string; dni: string; email: string; password: string; role: Role; vehicle: string; vehicleColor: string; plate: string; licenseNumber: string;
  emergencyContactName: string; emergencyContactPhone: string; emergencyContactRelationship: string;
}) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const userId = credential.user.uid;

  const userData = { name, dni, email, role, emergencyContactName, emergencyContactPhone, emergencyContactRelationship, createdAt: serverTimestamp() };
  await setDoc(doc(db, "users", userId), userData);
  const profile: UserProfile = { id: userId, name, dni, email, role, emergencyContactName, emergencyContactPhone, emergencyContactRelationship };

  if (role === "driver") {
    const baseDriverData = {
      userId, name, dni, vehicle, vehicleColor, plate, licenseNumber,
      verified: true,
      faceRecognitionStatus: "approved_simulated",
      legalVerificationStatus: "approved_simulated",
      vehicleVerificationStatus: "approved_simulated",
      penaltyStatus: "none",
      rating: 4.8,
      completedTrips: 42,
      cancellationRate: 0.03,
    };
    const trustScore = calculateTrustScore(baseDriverData);
    await setDoc(doc(db, "drivers", userId), { ...baseDriverData, trustScore, createdAt: serverTimestamp() });
  }
  return profile;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return getUserProfile(credential.user.uid);
}

export async function getUserProfile(userId: string) {
  const userSnap = await getDoc(doc(db, "users", userId));
  if (!userSnap.exists()) throw new Error("El usuario existe, pero no tiene perfil de aplicación.");
  return { id: userSnap.id, ...userSnap.data() } as UserProfile;
}

export async function logoutUser() { await signOut(auth); }

export async function getDriverProfile(driverId: string) {
  const driverSnap = await getDoc(doc(db, "drivers", driverId));
  if (!driverSnap.exists()) return null;
  return { id: driverSnap.id, ...driverSnap.data() } as DriverProfile;
}
