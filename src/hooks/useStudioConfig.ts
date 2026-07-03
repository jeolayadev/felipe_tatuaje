import { useCallback, useEffect, useState } from 'react';

/**
 * Configuración del estudio administrable (beta): pasarela de pago.
 *
 * Mercado Pago no permite cobrar de forma segura 100% en el navegador (la clave
 * secreta del vendedor no puede exponerse en el frontend). La vía correcta para
 * un sitio estático es un "Link de pago" que el tatuador crea en su cuenta de
 * Mercado Pago para el monto del abono; aquí se guarda ese link y se muestra un
 * botón de pago. La automatización total (crear preferencias dinámicas y
 * confirmar el pago) llegará con el backend (Firebase Functions) del roadmap.
 */
export type StudioConfig = {
  mpLink: string;
  abonoAmount: number;
};

const KEY = 'inkepilef-config-v1';
const EVENT = 'inkepilef-config-change';
const DEFAULT: StudioConfig = { mpLink: '', abonoAmount: 15000 };

const read = (): StudioConfig => {
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
  const [config, setConfig] = useState<StudioConfig>(read);

  useEffect(() => {
    const sync = () => setConfig(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const save = useCallback((patch: Partial<StudioConfig>) => {
    const next = { ...read(), ...patch };
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* noop */
    }
    setConfig(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return { ...config, save };
};

export const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`;
