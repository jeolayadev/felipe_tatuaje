import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/**
 * Inicialización de Firebase.
 *
 * La configuración se lee de variables de entorno (VITE_FIREBASE_*). Estos
 * valores NO son secretos: viajan al navegador en cualquier app Firebase. La
 * seguridad real se define en las Reglas de Firestore/Storage y en Auth.
 *
 * Si no hay configuración, `isFirebaseConfigured` es false y la app sigue
 * funcionando con almacenamiento local (modo beta), sin romperse.
 */
/* Config del proyecto Inkepilef. Los valores por defecto permiten que el sitio
   desplegado funcione sin depender de Secrets; se pueden sobreescribir con
   variables de entorno (VITE_FIREBASE_*) para dev local u otros entornos. */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyAKVVduzDDtT1L6sxhMLXa4WvH2HuHQx5A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'inkepilef.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'inkepilef',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'inkepilef.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '350310734161',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:350310734161:web:ee0aa95bfdbd4e4fba5b70',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage };
