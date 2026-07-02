/**
 * Fotos del portafolio — todas locales (public/gallery/).
 * Nota beta: son fotos de referencia; se reemplazan 1:1 por los trabajos
 * reales del estudio cuando el cliente entregue su material.
 */

export const BG_WALLPAPER = './bg-wallpaper.jpg';

const BASE = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/felipe_tatuaje/';

const gallery = (file: string) => `${BASE}gallery/${file}`;

/** Trabajos del estudio, etiquetados por estilo (negro y grises). */
export const PORTFOLIO_WORKS = [
  {
    id: 1,
    titulo: 'Dragón en brazo',
    categoria: 'Blackwork',
    src: gallery('1.jpg'),
    alt: 'Tatuaje de dragón en negro en el brazo',
  },
  {
    id: 2,
    titulo: 'Espalda completa',
    categoria: 'Tradicional',
    src: gallery('2.jpg'),
    alt: 'Tatuaje tradicional de gran formato en la espalda',
  },
  {
    id: 3,
    titulo: 'Floral en antebrazo',
    categoria: 'Fine Line',
    src: gallery('3.jpg'),
    alt: 'Tatuaje floral de líneas finas en el antebrazo',
  },
  {
    id: 4,
    titulo: 'Girasol realista',
    categoria: 'Realismo',
    src: gallery('4-TOP-4-Tatuajes-en-el-Antebrazo-Girasol-Realista-con-Ramas-Hojas-Pajaros-Golondrinas-en-Negro.jpg'),
    alt: 'Tatuaje realista de girasol con aves en negro',
  },
  {
    id: 5,
    titulo: 'Detalle en estudio',
    categoria: 'Fine Line',
    src: gallery('4c92b8553bc6c61b2f68658120c95873.jpg'),
    alt: 'Detalle de sesión de tatuaje de líneas finas en el estudio',
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

/** Hero — una foto local por estilo del estudio. */
export const TATTOO_BY_STYLE = {
  Realismo: {
    src: gallery('4-TOP-4-Tatuajes-en-el-Antebrazo-Girasol-Realista-con-Ramas-Hojas-Pajaros-Golondrinas-en-Negro.jpg'),
    alt: 'Tatuaje realista en negro y grises',
  },
  Blackwork: {
    src: gallery('2bfc6684e7db2ed26424a3d54836170f.jpg'),
    alt: 'Tatuaje blackwork en la muñeca',
  },
  'Fine Line': {
    src: gallery('4c92b8553bc6c61b2f68658120c95873.jpg'),
    alt: 'Tatuaje de líneas finas',
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

/** Imagen del bloque "nuestro estudio" en Contacto — local. */
export const STUDIO_IMAGE = {
  src: gallery('4c92b8553bc6c61b2f68658120c95873.jpg'),
  alt: 'Sesión de tatuaje en el estudio Inkepilef',
};
