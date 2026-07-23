export type Role = "passenger" | "driver";
export type AuthMode = "login" | "register";

export type ScreenName =
  | "auth"
  | "passengerHome"
  | "locationPicker"
  | "waitingOffers"
  | "driverHome"
  | "activeTrip"
  | "rating"
  | "profile";

export type TripStatus = "driver_on_way" | "in_progress" | "completed" | "rated" | "cancelled";
export type LocationTarget = "origin" | "destination";

export type UserProfile = {
  id: string;
  name: string;
  dni: string;
  email: string;
  role: Role;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  createdAt?: unknown;
};

export type DriverProfile = {
  id: string;
  userId: string;
  name: string;
  dni?: string;
  vehicle: string;
  vehicleColor?: string;
  plate: string;
  licenseNumber?: string;
  verified: boolean;
  faceRecognitionStatus: "approved" | "pending" | "rejected" | "approved_simulated";
  legalVerificationStatus: "approved" | "pending" | "rejected" | "approved_simulated";
  vehicleVerificationStatus?: "approved" | "pending" | "rejected" | "approved_simulated";
  penaltyStatus: "none" | "warning_simulated" | "restricted_simulated";
  rating: number;
  completedTrips: number;
  cancellationRate: number;
  trustScore: number;
};

export type RoutePoint = {
  name: string;
  latitude: number;
  longitude: number;
};

export type RideRequest = {
  id: string;
  passengerId: string;
  passengerName: string;
  originName: string;
  destinationName: string;
  distanceKm: number;
  suggestedPrice: number;
  minRecommendedPrice: number;
  maxRecommendedPrice: number;
  passengerPrice: number;
  status: string;
  paymentMethod: "cash";
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  safeNightMode: boolean;
  quietMode: boolean;
  passengerNote?: string;
  createdAt?: unknown;
};

export type Offer = {
  id: string;
  rideRequestId: string;
  driverId: string;
  driverName: string;
  vehicle: string;
  vehicleColor?: string;
  plate: string;
  rating: number;
  completedTrips: number;
  verified: boolean;
  trustScore: number;
  offeredPrice: number;
  status: "pending" | "accepted" | "rejected";
  recommendationLabel?: string;
  createdAt?: unknown;
};

export type Trip = {
  id: string;
  rideRequestId: string;
  passengerId: string;
  passengerName: string;
  driverId: string;
  driverName: string;
  vehicle: string;
  vehicleColor?: string;
  plate: string;
  trustScore: number;
  finalPrice: number;
  status: TripStatus;
  originName: string;
  destinationName: string;
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  paymentMethod: "cash";
  safeNightMode: boolean;
  quietMode: boolean;
  passengerNote?: string;
  emergencyStatus?: "none" | "active" | "resolved";
  lastEmergencyByRole?: Role;
  lastEmergencyByName?: string;
  lastEmergencyAt?: unknown;
  createdAt?: unknown;
};

export type ChatMessage = {
  id: string;
  tripId: string;
  fromUserId: string;
  fromName: string;
  fromRole: Role;
  text: string;
  createdAt?: unknown;
  localOnly?: boolean;
};
