import { useCallback, useState } from 'react';

/**
 * Autenticacion de demo para la vista tatuador (beta).
 * Guarda la sesion en sessionStorage (se cierra al cerrar la pestaña).
 *
 * NOTA: es un control de acceso de maqueta, no seguridad real. En el roadmap
 * se reemplaza por Firebase Authentication (correo/contraseña o Google) con
 * roles y reglas de seguridad en el backend.
 */
const STORAGE_KEY = 'inkepilef-artist-auth';
export const ARTIST_PASSCODE = 'inke2026';

export const useArtistAuth = () => {
  const [authed, setAuthed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const login = useCallback((code: string) => {
    if (code.trim() === ARTIST_PASSCODE) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* almacenamiento no disponible: igual autorizamos en memoria */
      }
      setAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setAuthed(false);
  }, []);

  return { authed, login, logout };
};
