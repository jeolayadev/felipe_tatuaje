import { useCallback, useEffect, useRef, useState } from 'react';
import { PORTFOLIO_WORKS } from '../data/images';

/**
 * Galería administrable por el tatuador (beta).
 * Guarda en localStorage la lista de imágenes del portafolio y los ajustes del
 * carrusel (cantidad visible y velocidad). El tatuador la edita desde su panel
 * y el cambio se refleja en la vista cliente. En etapas futuras esto vivirá en
 * Firebase (Firestore + Storage) para compartirse entre dispositivos.
 */
export type GalleryImage = {
  id: string;
  src: string;
  titulo: string;
  categoria: string;
  alt?: string;
};

export type GalleryState = {
  images: GalleryImage[];
  carouselCount: number;
  autoplayMs: number;
};

const KEY = 'inkepilef-gallery-v1';
const EVENT = 'inkepilef-gallery-change';

const DEFAULT_STATE: GalleryState = {
  images: PORTFOLIO_WORKS.map((w) => ({
    id: String(w.id),
    src: w.src,
    titulo: w.titulo,
    categoria: w.categoria,
    alt: w.alt,
  })),
  carouselCount: 6,
  autoplayMs: 5000,
};

const clampCount = (n: number, max: number) =>
  Math.max(1, Math.min(Math.round(n), Math.max(1, max)));

const readState = (): GalleryState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<GalleryState>;
    if (!parsed || !Array.isArray(parsed.images) || parsed.images.length === 0) {
      return DEFAULT_STATE;
    }
    return {
      images: parsed.images,
      carouselCount: clampCount(parsed.carouselCount ?? 6, parsed.images.length),
      autoplayMs: Math.max(1500, Math.min(parsed.autoplayMs ?? 5000, 12000)),
    };
  } catch {
    return DEFAULT_STATE;
  }
};

const uid = () =>
  `img-${Date.now().toString(36)}-${Math.floor(performance.now() % 1000)}`;

export const useGallery = () => {
  const [state, setState] = useState<GalleryState>(readState);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const sync = () => setState(readState());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  /** Persiste y notifica. Devuelve true si se guardó (false si excede la cuota). */
  const commit = useCallback((next: GalleryState): boolean => {
    let ok = true;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      ok = false;
    }
    setState(next);
    window.dispatchEvent(new Event(EVENT));
    return ok;
  }, []);

  const addImage = useCallback(
    (img: Omit<GalleryImage, 'id'>): boolean => {
      const prev = stateRef.current;
      const next: GalleryState = {
        ...prev,
        images: [...prev.images, { ...img, id: uid() }],
      };
      return commit(next);
    },
    [commit]
  );

  const updateImage = useCallback(
    (id: string, patch: Partial<Omit<GalleryImage, 'id'>>): boolean => {
      const prev = stateRef.current;
      const next: GalleryState = {
        ...prev,
        images: prev.images.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      };
      return commit(next);
    },
    [commit]
  );

  const removeImage = useCallback(
    (id: string): boolean => {
      const prev = stateRef.current;
      const images = prev.images.filter((it) => it.id !== id);
      if (images.length === 0) return false; // no permitir dejar la galería vacía
      const next: GalleryState = {
        ...prev,
        images,
        carouselCount: clampCount(prev.carouselCount, images.length),
      };
      return commit(next);
    },
    [commit]
  );

  const moveImage = useCallback(
    (id: string, dir: -1 | 1): boolean => {
      const prev = stateRef.current;
      const idx = prev.images.findIndex((it) => it.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.images.length) return false;
      const images = [...prev.images];
      [images[idx], images[target]] = [images[target], images[idx]];
      return commit({ ...prev, images });
    },
    [commit]
  );

  const setCarouselCount = useCallback(
    (n: number): boolean => {
      const prev = stateRef.current;
      return commit({ ...prev, carouselCount: clampCount(n, prev.images.length) });
    },
    [commit]
  );

  const setAutoplayMs = useCallback(
    (ms: number): boolean => {
      const prev = stateRef.current;
      return commit({ ...prev, autoplayMs: Math.max(1500, Math.min(ms, 12000)) });
    },
    [commit]
  );

  const resetGallery = useCallback((): boolean => commit(DEFAULT_STATE), [commit]);

  return {
    ...state,
    addImage,
    updateImage,
    removeImage,
    moveImage,
    setCarouselCount,
    setAutoplayMs,
    resetGallery,
  };
};
