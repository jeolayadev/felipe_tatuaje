import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

/**
 * Configuración del estudio: pasarela de pago (abono con Mercado Pago).
 * En config/studio de Firestore cuando hay Firebase; localStorage como respaldo.
 */
export type StudioConfig = {
  mpLink: string;
  abonoAmount: number;
};

const KEY = 'inkepilef-config-v1';
const DEFAULT: StudioConfig = { mpLink: '', abonoAmount: 15000 };

const readLocal = (): StudioConfig => {
  if (typeof window === 'undefined') return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as Partial<StudioConfig>;
    return {
      mpLink: typeof p.mpLink === 'string' ? p.mpLink : '',
      abonoAmount: Number(p.abonoAmount) > 0 ? Number(p.abonoAmount) : 15000,
    };
  } catch {
    return DEFAULT;
  }
};

export const useStudioConfig = () => {
  const [config, setConfig] = useState<StudioConfig>(readLocal);
  const ref = useRef(config);
  useEffect(() => {
    ref.current = config;
  }, [config]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsub = onSnapshot(
      doc(db, 'config', 'studio'),
      (snap) => {
        if (snap.exists()) setConfig({ ...DEFAULT, ...(snap.data() as Partial<StudioConfig>) });
      },
      () => {}
    );
    return unsub;
  }, []);

  const save = useCallback((patch: Partial<StudioConfig>) => {
    const next = { ...ref.current, ...patch };
    ref.current = next;
    setConfig(next);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'config', 'studio'), next).catch(() => {});
    } else {
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
    }
  }, []);

  return { ...config, save };
};

export const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`;
