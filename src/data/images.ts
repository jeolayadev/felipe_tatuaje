/**
 * Fotos del portafolio — todas locales (public/gallery/).
 * Nota beta: son fotos de referencia; se reemplazan 1:1 por los trabajos
 * reales del estudio cuando el cliente entregue su material.
 */

export const BG_WALLPAPER = './bg-wallpaper.jpg';

const BASE = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/felipe_tatuaje/';

const gallery = (file: string) => `${BASE}gallery/${file}`;

/** Trabajos del estudio, etiquetados por estilo (negro y grises).
 *  Los primeros son trabajos REALES de Inkepilef; los marcados como
 *  referencia se reemplazan cuando llegue más material del cliente. */
export const PORTFOLIO_WORKS = [
  {
    id: 1,
    titulo: 'Medusa en brazo',
    categoria: 'Realismo',
    src: gallery('inke-realismo-medusa.jpg'),
    alt: 'Tatuaje realista de Medusa con serpientes y rosa en el brazo',
  },
  {
    id: 2,
    titulo: 'Floral con mariposas',
    categoria: 'Fine Line',
    src: gallery('inke-fineline-floral.jpg'),
    alt: 'Tatuaje de rosas y mariposas en líneas finas en el antebrazo',
  },
  {
    id: 3,
    titulo: 'Manos — recuerdo familiar',
    categoria: 'Fine Line',
    src: gallery('inke-fineline-iquique.jpg'),
    alt: 'Tatuaje de manos unidas con palmeras y siluetas familiares',
  },
  // --- referencia (pendiente material del cliente) ---
  {
    id: 4,
    titulo: 'Dragón en brazo',
    categoria: 'Blackwork',
    src: gallery('1.jpg'),
    alt: 'Tatuaje de dragón en negro en el brazo',
  },
  {
    id: 5,
    titulo: 'Espalda completa',
    categoria: 'Tradicional',
    src: gallery('2.jpg'),
    alt: 'Tatuaje tradicional de gran formato en la espalda',
  },
  {
    id: 6,
    titulo: 'Dragón en espalda',
    categoria: 'Blackwork',
    src: gallery('Japanese-Dragon-Back-Tattoo-774x960.jpg'),
    alt: 'Tatuaje de dragón en negro cubriendo la espalda',
  },
] as const;

export const PORTFOLIO_IMAGES = PORTFOLIO_WORKS;

/** Hero — una foto por estilo (Realismo y Fine Line ya son trabajos reales). */
export const TATTOO_BY_STYLE = {
  Realismo: {
    src: gallery('inke-realismo-medusa.jpg'),
    alt: 'Tatuaje realista de Medusa en el brazo',
  },
  Blackwork: {
    src: gallery('2bfc6684e7db2ed26424a3d54836170f.jpg'),
    alt: 'Tatuaje blackwork en la muñeca',
  },
  'Fine Line': {
    src: gallery('inke-fineline-floral.jpg'),
    alt: 'Tatuaje floral de líneas finas con mariposas',
  },
  Tradicional: {
    src: gallery('2.jpg'),
    alt: 'Tatuaje tradicional de gran formato',
  },
} as const;

export type TattooStyle = keyof typeof TATTOO_BY_STYLE;

export const HERO_IMAGES = (Object.keys(TATTOO_BY_STYLE) as TattooStyle[]).map(
  (estilo) => ({
    estilo,
    src: TATTOO_BY_STYLE[estilo].src,
    alt: TATTOO_BY_STYLE[estilo].alt,
  })
);

/** Imagen del bloque "nuestro estudio" en Contacto — Felipe en sesión. */
export const STUDIO_IMAGE = {
  src: gallery('inke-estudio-felipe.jpg'),
  alt: 'Felipe tatuando en el estudio Inkepilef',
};
