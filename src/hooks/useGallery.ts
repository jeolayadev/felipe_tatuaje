import { useCallback, useEffect, useRef, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import { uploadGalleryImage, deleteGalleryImage } from '../firebase/images';
import { PORTFOLIO_WORKS, HERO_IMAGES } from '../data/images';

/**
 * Galería administrable por el tatuador.
 * Con Firebase: metadatos en Firestore (doc config/gallery) y archivos en
 * Storage (gallery/<id>.jpg) -> visibles desde cualquier dispositivo.
 * Sin Firebase: fallback a localStorage (modo beta).
 */
export type GalleryImage = {
  id: string;
  src: string;
  titulo: string;
  categoria: string;
  alt?: string;
};

export type HeroImage = {
  id: string;
  estilo: string;
  src: string;
  alt?: string;
};

export type GalleryState = {
  images: GalleryImage[];
  hero: HeroImage[];
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
  hero: HERO_IMAGES.map((h, i) => ({
    id: `hero-${i}`,
    estilo: h.estilo,
    src: h.src,
    alt: h.alt,
  })),
  carouselCount: 6,
  autoplayMs: 5000,
};

const clampCount = (n: number, max: number) =>
  Math.max(1, Math.min(Math.round(n), Math.max(1, max)));

const normalize = (parsed: Partial<GalleryState> | null | undefined): GalleryState => {
  if (!parsed || !Array.isArray(parsed.images) || parsed.images.length === 0) {
    return DEFAULT_STATE;
  }
  return {
    images: parsed.images,
    hero: Array.isArray(parsed.hero) && parsed.hero.length ? parsed.hero : DEFAULT_STATE.hero,
    carouselCount: clampCount(parsed.carouselCount ?? 6, parsed.images.length),
    autoplayMs: Math.max(1500, Math.min(parsed.autoplayMs ?? 5000, 12000)),
  };
};

const readLocal = (): GalleryState => {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    return normalize(raw ? (JSON.parse(raw) as Partial<GalleryState>) : null);
  } catch {
    return DEFAULT_STATE;
  }
};

const uid = () =>
  `img-${Date.now().toString(36)}-${Math.floor(performance.now() % 1000)}`;

/** Data URLs no deben viajar a Firestore (límite 1MB/doc): se suben a Storage. */
const isDataUrl = (src: string) => src.startsWith('data:');

export const useGallery = () => {
  const [state, setState] = useState<GalleryState>(readLocal);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      const unsub = onSnapshot(
        doc(db, 'config', 'gallery'),
        (snap) => {
          if (snap.exists()) setState(normalize(snap.data() as Partial<GalleryState>));
        },
        () => {}
      );
      return unsub;
    }
    const sync = () => setState(readLocal());
    window.addEventListener(EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  /** Persiste el estado. Devuelve false si no se pudo guardar. */
  const commit = useCallback(async (next: GalleryState): Promise<boolean> => {
    setState(next);
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'config', 'gallery'), next);
        return true;
      } catch {
        return false;
      }
    }
    let ok = true;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      ok = false;
    }
    window.dispatchEvent(new Event(EVENT));
    return ok;
  }, []);

  /** Sube la foto a Storage si es un data URL (con Firebase). */
  const resolveSrc = useCallback(async (src: string, id: string): Promise<string> => {
    if (isFirebaseConfigured && isDataUrl(src)) {
      return uploadGalleryImage(src, id);
    }
    return src;
  }, []);

  const addImage = useCallback(
    async (img: Omit<GalleryImage, 'id'>): Promise<boolean> => {
      const id = uid();
      try {
        const src = await resolveSrc(img.src, id);
        return commit({
          ...stateRef.current,
          images: [...stateRef.current.images, { ...img, src, id }],
        });
      } catch {
        return false;
      }
    },
    [commit, resolveSrc]
  );

  const updateImage = useCallback(
    async (id: string, patch: Partial<Omit<GalleryImage, 'id'>>): Promise<boolean> => {
      try {
        const src = patch.src ? await resolveSrc(patch.src, id) : undefined;
        const prev = stateRef.current;
        return commit({
          ...prev,
          images: prev.images.map((it) =>
            it.id === id ? { ...it, ...patch, ...(src ? { src } : {}) } : it
          ),
        });
      } catch {
        return false;
      }
    },
    [commit, resolveSrc]
  );

  const removeImage = useCallback(
    async (id: string): Promise<boolean> => {
      const prev = stateRef.current;
      const target = prev.images.find((it) => it.id === id);
      const images = prev.images.filter((it) => it.id !== id);
      if (images.length === 0) return false; // no dejar la galería vacía
      const ok = await commit({
        ...prev,
        images,
        carouselCount: clampCount(prev.carouselCount, images.length),
      });
      if (ok && target) void deleteGalleryImage(target.src);
      return ok;
    },
    [commit]
  );

  const moveImage = useCallback(
    (id: string, dir: -1 | 1): Promise<boolean> => {
      const prev = stateRef.current;
      const idx = prev.images.findIndex((it) => it.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.images.length) return Promise.resolve(false);
      const images = [...prev.images];
      [images[idx], images[target]] = [images[target], images[idx]];
      return commit({ ...prev, images });
    },
    [commit]
  );

  const setCarouselCount = useCallback(
    (n: number): Promise<boolean> => {
      const prev = stateRef.current;
      return commit({ ...prev, carouselCount: clampCount(n, prev.images.length) });
    },
    [commit]
  );

  const setAutoplayMs = useCallback(
    (ms: number): Promise<boolean> => {
      const prev = stateRef.current;
      return commit({ ...prev, autoplayMs: Math.max(1500, Math.min(ms, 12000)) });
    },
    [commit]
  );

  /* ---- Imágenes del Hero (una por estilo) ---- */
  const addHero = useCallback(
    async (h: Omit<HeroImage, 'id'>): Promise<boolean> => {
      const id = uid();
      try {
        const src = await resolveSrc(h.src, id);
        return commit({
          ...stateRef.current,
          hero: [...stateRef.current.hero, { ...h, src, id }],
        });
      } catch {
        return false;
      }
    },
    [commit, resolveSrc]
  );

  const updateHero = useCallback(
    async (id: string, patch: Partial<Omit<HeroImage, 'id'>>): Promise<boolean> => {
      try {
        const src = patch.src ? await resolveSrc(patch.src, `${id}-${Date.now().toString(36)}`) : undefined;
        const prev = stateRef.current;
        return commit({
          ...prev,
          hero: prev.hero.map((it) =>
            it.id === id ? { ...it, ...patch, ...(src ? { src } : {}) } : it
          ),
        });
      } catch {
        return false;
      }
    },
    [commit, resolveSrc]
  );

  const removeHero = useCallback(
    async (id: string): Promise<boolean> => {
      const prev = stateRef.current;
      const target = prev.hero.find((it) => it.id === id);
      const hero = prev.hero.filter((it) => it.id !== id);
      if (hero.length === 0) return false;
      const ok = await commit({ ...prev, hero });
      if (ok && target) void deleteGalleryImage(target.src);
      return ok;
    },
    [commit]
  );

  const moveHero = useCallback(
    (id: string, dir: -1 | 1): Promise<boolean> => {
      const prev = stateRef.current;
      const idx = prev.hero.findIndex((it) => it.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.hero.length) return Promise.resolve(false);
      const hero = [...prev.hero];
      [hero[idx], hero[target]] = [hero[target], hero[idx]];
      return commit({ ...prev, hero });
    },
    [commit]
  );

  const resetGallery = useCallback((): Promise<boolean> => commit(DEFAULT_STATE), [commit]);

  return {
    ...state,
    addImage,
    updateImage,
    removeImage,
    moveImage,
    setCarouselCount,
    setAutoplayMs,
    addHero,
    updateHero,
    removeHero,
    moveHero,
    resetGallery,
  };
};
