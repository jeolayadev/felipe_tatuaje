import { useEffect, useState } from 'react';

/**
 * Hook reactivo para media queries. Permite renderizar versiones
 * mas ligeras de la UI en pantallas pequenas (mejor fluidez).
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
};

/** Telefonos (incluye el modo carrusel/version movil del sitio). */
export const useIsMobile = (): boolean => useMediaQuery('(max-width: 640px)');
