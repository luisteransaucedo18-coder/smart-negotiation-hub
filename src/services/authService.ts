import { createUserWithEmailAndPassword, deleteUser, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import { DriverProfile, Role, UserProfile } from "../types";
import { calculateTrustScore } from "./trustScoreService";

type ProfileInput = {
  name: string;
  dni: string;
  email: string;
  role: Role;
  vehicle: string;
  vehicleColor: string;
  plate: string;
  licenseNumber: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
};

export async function registerUser({
  name, dni, email, password, role, vehicle, vehicleColor, plate, licenseNumber, emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
}: ProfileInput & { password: string }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  try {
    return await saveApplicationProfile(credential.user.uid, { name, dni, email, role, vehicle, vehicleColor, plate, licenseNumber, emergencyContactName, emergencyContactPhone, emergencyContactRelationship });
  } catch (error) {
    await deleteUser(credential.user).catch(() => undefined);
    throw error;
  }
}

export async function loginUser(email: string, password: string, recoveryProfile?: ProfileInput) {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  return getUserProfile(credential.user.uid).catch(async (error) => {
    if (!isMissingApplicationProfileError(error) || !recoveryProfile) throw error;
    return saveApplicationProfile(credential.user.uid, { ...recoveryProfile, email });
  });
}

export async function getUserProfile(userId: string) {
  const userSnap = await getDoc(doc(db, "users", userId));
  if (!userSnap.exists()) throw new Error("MISSING_APPLICATION_PROFILE");
  return { id: userSnap.id, ...userSnap.data() } as UserProfile;
}

export async function logoutUser() { await signOut(auth); }

export async function getDriverProfile(driverId: string) {
  const driverSnap = await getDoc(doc(db, "drivers", driverId));
  if (!driverSnap.exists()) return null;
  return { id: driverSnap.id, ...driverSnap.data() } as DriverProfile;
}

async function saveApplicationProfile(userId: string, input: ProfileInput) {
  const { name, dni, email, role, vehicle, vehicleColor, plate, licenseNumber, emergencyContactName, emergencyContactPhone, emergencyContactRelationship } = input;
  const userData = { name, dni, email, role, emergencyContactName, emergencyContactPhone, emergencyContactRelationship, createdAt: serverTimestamp() };
  const profile: UserProfile = { id: userId, name, dni, email, role, emergencyContactName, emergencyContactPhone, emergencyContactRelationship };
  const batch = writeBatch(db);

  batch.set(doc(db, "users", userId), userData);

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
    batch.set(doc(db, "drivers", userId), { ...baseDriverData, trustScore, createdAt: serverTimestamp() });
  }

  await batch.commit();
  return profile;
}

function isMissingApplicationProfileError(error: unknown) {
  return error instanceof Error && error.message === "MISSING_APPLICATION_PROFILE";
}
