import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Autenticación del tatuador (admin) con correo/contraseña.
 * Los clientes NO necesitan sesión: reservan de forma pública (validado por
 * las Reglas de Firestore). El único que inicia sesión es el tatuador.
 */
export const adminSignIn = (email: string, password: string) => {
  if (!auth) throw new Error('Firebase no está configurado.');
  return signInWithEmailAndPassword(auth, email.trim(), password);
};

export const adminSignOut = () => {
  if (!auth) return Promise.resolve();
  return signOut(auth);
};

export const watchAuth = (cb: (user: User | null) => void) => {
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
};

/** Traduce el código de error de Firebase a un mensaje claro en español. */
export const authErrorMessage = (code: string): string => {
  switch (code) {
    case 'auth/invalid-email':
      return 'El correo no es válido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos e intenta de nuevo.';
    case 'auth/network-request-failed':
      return 'Sin conexión. Revisa tu internet.';
    default:
      return 'No se pudo iniciar sesión. Intenta nuevamente.';
  }
};
