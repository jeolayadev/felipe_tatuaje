import { useCallback, useEffect, useState } from 'react';
import { isFirebaseConfigured } from '../firebase/config';
import {
  adminSignIn,
  registerAccount,
  adminSignOut,
  watchAuth,
  authErrorMessage,
} from '../firebase/auth';
import { ADMIN_EMAIL } from '../utils/constants';

/**
 * Sesión con Firebase Authentication (correo/contraseña).
 * Cualquiera puede crear cuenta e iniciar sesión, pero el panel del tatuador
 * (vista admin) solo es visible para ADMIN_EMAIL (el correo del estudio).
 * `ready` = ya se resolvió el estado inicial de auth (evita parpadeos).
 */
export const useArtistAuth = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsub = watchAuth((user) => {
      setEmail(user?.email ?? null);
      setReady(true);
    });
    return unsub;
  }, []);

  const authed = email !== null;
  const isAdmin = authed && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  /** Devuelve null si fue exitoso, o un mensaje de error. */
  const login = useCallback(async (mail: string, password: string): Promise<string | null> => {
    if (!isFirebaseConfigured) return 'Firebase no está configurado todavía.';
    try {
      await adminSignIn(mail, password);
      return null;
    } catch (err) {
      return authErrorMessage((err as { code?: string })?.code ?? '');
    }
  }, []);

  /** Crea la cuenta y deja la sesión iniciada. Devuelve null o mensaje de error. */
  const register = useCallback(async (mail: string, password: string): Promise<string | null> => {
    if (!isFirebaseConfigured) return 'Firebase no está configurado todavía.';
    try {
      await registerAccount(mail, password);
      return null;
    } catch (err) {
      return authErrorMessage((err as { code?: string })?.code ?? '');
    }
  }, []);

  const logout = useCallback(() => {
    void adminSignOut();
  }, []);

  return { authed, isAdmin, email, ready, login, register, logout };
};
