import { Role } from "../types";

export function isValidFullName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => part.length >= 2);
}
export function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()); }
export function isValidDni(dni: string) { return /^\d{8}$/.test(dni.trim()); }
export function isValidPhone(phone: string) { return /^9\d{8}$/.test(phone.trim()); }
export function isValidPassword(password: string) { return password.length >= 6; }
export function isValidPlate(plate: string) { return /^[A-Z0-9]{3}-?[A-Z0-9]{3}$/.test(plate.trim().toUpperCase()); }
export function isValidLicense(value: string) { return value.trim().length >= 6; }

export function validateRegisterForm({
  name, dni, email, password, role, vehicle, vehicleColor, plate, licenseNumber, emergencyContactName, emergencyContactPhone, emergencyContactRelationship,
}: {
  name: string; dni: string; email: string; password: string; role: Role; vehicle: string; vehicleColor: string; plate: string; licenseNumber: string;
  emergencyContactName: string; emergencyContactPhone: string; emergencyContactRelationship: string;
}) {
  if (!isValidFullName(name)) return "Ingresa nombre y apellido. Ejemplo: Luis Teran.";
  if (!isValidDni(dni)) return "Ingresa un DNI valido de 8 digitos.";
  if (!isValidEmail(email)) return "Ingresa un correo valido.";
  if (!isValidPassword(password)) return "La contrasena debe tener minimo 6 caracteres.";
  if (!isValidFullName(emergencyContactName)) return "Ingresa nombre y apellido del contacto de emergencia.";
  if (!isValidPhone(emergencyContactPhone)) return "Ingresa un telefono peruano valido de 9 digitos que empiece en 9.";
  if (emergencyContactRelationship.trim().length < 3) return "Ingresa el parentesco del contacto de emergencia.";
  if (role === "driver") {
    if (vehicle.trim().length < 3) return "Ingresa el modelo del vehiculo.";
    if (vehicleColor.trim().length < 3) return "Ingresa el color del vehiculo.";
    if (!isValidPlate(plate)) return "Ingresa una placa valida. Ejemplo: ABC-123.";
    if (!isValidLicense(licenseNumber)) return "Ingresa un numero de licencia valido.";
  }
  return null;
}

export function validateLoginForm(email: string, password: string) {
  if (!isValidEmail(email)) return "Ingresa un correo valido.";
  if (!password) return "Ingresa tu contrasena.";
  return null;
}

export function validatePrice(price: number, min: number, max: number) {
  if (!Number.isFinite(price) || price <= 0) return "Ingresa una tarifa valida mayor a cero.";
  if (price < min) return `La tarifa esta por debajo del rango justo. Minimo sugerido: S/ ${min.toFixed(2)}.`;
  if (price > max * 1.45) return "La tarifa esta demasiado alejada del rango sugerido.";
  return null;
}
