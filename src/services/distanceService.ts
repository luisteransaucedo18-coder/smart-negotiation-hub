import { RoutePoint } from "../types";

export const TRUJILLO_POINTS: RoutePoint[] = [
  { name: "Universidad UTP", latitude: -8.1116, longitude: -79.0287 },
  { name: "Mall Aventura", latitude: -8.1025, longitude: -79.0369 },
  { name: "Plaza de Armas de Trujillo", latitude: -8.1119, longitude: -79.0288 },
  { name: "Real Plaza Trujillo", latitude: -8.1018, longitude: -79.0452 },
  { name: "Terminal Terrestre", latitude: -8.1273, longitude: -79.0382 },
  { name: "UPAO", latitude: -8.1302, longitude: -79.0338 },
  { name: "Óvalo Papal", latitude: -8.1215, longitude: -79.0336 },
];

function toRadians(value: number) { return (value * Math.PI) / 180; }
export function calculateDistanceKm(originLat: number, originLng: number, destinationLat: number, destinationLng: number) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(destinationLat - originLat);
  const dLng = toRadians(destinationLng - originLng);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(originLat)) * Math.cos(toRadians(destinationLat)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c * 1.28).toFixed(2));
}
export function createMapPointName(prefix: "Origen" | "Destino", latitude: number, longitude: number) {
  return `${prefix} seleccionado (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
}
