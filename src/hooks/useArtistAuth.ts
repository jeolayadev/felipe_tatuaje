import { useCallback, useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../firebase/config';
import { adminSignIn, adminSignOut, watchAuth, authErrorMessage } from '../firebase/auth';

/**
 * Sesión del tatuador con Firebase Authentication (correo/contraseña).
 * `authed` = hay un usuario con sesión. `ready` = ya se resolvió el estado
 * inicial de auth (evita parpadeos entre login y panel al recargar).
 */
export const useArtistAuth = () => {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = watchAuth((user) => {
      setAuthed(!!user);
      setReady(true);
    });
    return unsub;
  }, []);

  /** Devuelve null si el inicio fue exitoso, o un mensaje de error. */
  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (!isFirebaseConfigured) return 'Firebase no está configurado todavía.';
    try {
      await adminSignIn(email, password);
      return null;
    } catch (err) {
      const code = (err as { code?: string })?.code ?? '';
      return authErrorMessage(code);
    }
  }, []);

  const logout = useCallback(() => {
    void adminSignOut();
  }, []);

  return { authed, ready, login, logout };
};
