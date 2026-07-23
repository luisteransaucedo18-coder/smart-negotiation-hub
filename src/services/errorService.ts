export function getErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") return "Ocurrio un error inesperado.";

  const code = "code" in error && typeof error.code === "string" ? error.code : "";
  if (code === "auth/email-already-in-use") return "Ese correo ya esta registrado. Inicia sesion o usa otro correo.";
  if (code === "auth/invalid-credential") return "Correo o contrasena incorrectos, o la cuenta no existe en Firebase Auth.";
  if (code === "auth/invalid-email") return "El correo no tiene un formato valido.";
  if (code === "auth/user-not-found") return "No existe una cuenta registrada con ese correo.";
  if (code === "auth/wrong-password") return "La contrasena es incorrecta.";
  if (code === "auth/weak-password") return "La contrasena debe tener minimo 6 caracteres.";
  if (code === "auth/operation-not-allowed") return "El registro con correo y contrasena no esta habilitado en Firebase Auth.";
  if (code === "auth/network-request-failed") return "No se pudo conectar con Firebase. Revisa tu conexion e intentalo de nuevo.";
  if (code === "permission-denied") return "Firebase rechazo guardar el perfil. Revisa las reglas de Firestore para permitir crear documentos en users y drivers con el uid del usuario autenticado.";
  if (code === "unavailable") return "Firestore no esta disponible en este momento. Intentalo nuevamente.";

  if (error instanceof Error && error.message === "MISSING_APPLICATION_PROFILE") return "La cuenta existe en Firebase Auth, pero no tiene perfil en Firestore. Elige el rol correcto e intenta ingresar de nuevo para reconstruirlo.";
  if (error instanceof Error && error.message === "ROLE_MISMATCH_DRIVER") return "Esta cuenta esta registrada como conductor. Cambia el tipo de usuario a Conductor para ingresar.";
  if (error instanceof Error && error.message === "ROLE_MISMATCH_PASSENGER") return "Esta cuenta esta registrada como pasajero. Cambia el tipo de usuario a Pasajero para ingresar.";
  if (error instanceof Error && error.message.includes("ERR_BLOCKED_BY_CLIENT")) return "El navegador o una extension esta bloqueando Firestore. Desactiva Brave Shields/adblock para localhost o prueba en Chrome/Edge sin extensiones.";
  if (error instanceof Error) return error.message;
  return "Ocurrio un error inesperado.";
}
