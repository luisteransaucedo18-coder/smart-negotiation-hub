import * as Location from "expo-location";
import { RoutePoint } from "../types";

function formatAddress(address?: Location.LocationGeocodedAddress) {
  if (!address) return "";
  const parts = [
    address.name,
    address.street,
    address.district,
    address.city,
    address.region,
  ].filter(Boolean);
  return Array.from(new Set(parts)).join(", ");
}

export async function reverseGeocodePoint(latitude: number, longitude: number) {
  try {
    const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
    return formatAddress(address) || `Lat. ${latitude.toFixed(5)}, Lng. ${longitude.toFixed(5)}`;
  } catch {
    return `Lat. ${latitude.toFixed(5)}, Lng. ${longitude.toFixed(5)}`;
  }
}

export async function getCurrentRoutePoint(): Promise<RoutePoint | null> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted") return null;

  const lastKnown = await Location.getLastKnownPositionAsync({ maxAge: 120000 });
  const location = lastKnown ?? await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
    mayShowUserSettingsDialog: true,
  });

  const { latitude, longitude } = location.coords;
  const name = await reverseGeocodePoint(latitude, longitude);
  return { latitude, longitude, name };
}
