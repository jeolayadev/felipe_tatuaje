/**
 * Solo fotos de TATUAJES verificadas (Unsplash)
 * Sin joyería ni imágenes ajenas al rubro
 */

const unsplash = (id: string, w = 1200, h = 1500) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=90`;

export const BG_WALLPAPER = './bg-wallpaper.jpg';

/** Trabajos japoneses — cada URL es sesión o pieza de tatuaje real */
export const JAPANESE_WORKS_HD = [
  {
    id: 1,
    titulo: 'Dragón irezumi',
    categoria: 'Dragón',
    estilo: 'Japonés' as const,
    src: unsplash('1578482326433-ad1aabb9c928'),
    alt: 'Tatuaje japonés de dragón en el brazo',
  },
  {
    id: 2,
    titulo: 'Espalda japonesa',
    categoria: 'Espalda',
    estilo: 'Japonés' as const,
    src: unsplash('1611501437281-430bfbe1220a'),
    alt: 'Gran tatuaje japonés en la espalda',
  },
  {
    id: 3,
    titulo: 'Sesión en brazo',
    categoria: 'Irezumi',
    estilo: 'Japonés' as const,
    src: unsplash('1597318911596-6fefab434df5'),
    alt: 'Tatuaje irezumi japonés en el brazo',
  },
  {
    id: 4,
    titulo: 'Tatuaje en pierna',
    categoria: 'Manga',
    estilo: 'Japonés' as const,
    src: unsplash('1721160223584-b3a19f2e0e6a'),
    alt: 'Tatuaje manga en la pierna',
  },
  {
    id: 5,
    titulo: 'Trabajo en estudio',
    categoria: 'Irezumi',
    estilo: 'Japonés' as const,
    src: unsplash('1704345910291-49168c7631b6'),
    alt: 'Tatuador trabajando en el estudio',
  },
  {
    id: 6,
    titulo: 'Proceso de tatuaje',
    categoria: 'Koi',
    estilo: 'Japonés' as const,
    src: unsplash('1562962230-16e4623d36e6'),
    alt: 'Cliente recibiendo tatuaje koi en el estudio',
  },
] as const;

export type JapaneseCategory = (typeof JAPANESE_WORKS_HD)[number]['categoria'];

export const PORTFOLIO_IMAGES = [...JAPANESE_WORKS_HD];

/** Hero — una foto de tatuaje por estilo */
export const TATTOO_BY_STYLE = {
  Blackwork: {
    src: unsplash('1562962230-16e4623d36e6'),
    alt: 'Tatuaje blackwork floral en brazo',
  },
  Japonés: {
    src: JAPANESE_WORKS_HD[0].src,
    alt: JAPANESE_WORKS_HD[0].alt,
  },
  Realismo: {
    src: unsplash('1557286581-db06124ae2f'),
    alt: 'Tatuajes realistas en el cuerpo',
  },
  Geométrico: {
    src: unsplash('1613682719869-662cb221149f'),
    alt: 'Manga con tatuajes geométricos',
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

/** Interior de estudio de tatuajes */
export const STUDIO_IMAGE = {
  src: unsplash('1704345910291-49168c7631b6', 900, 560),
  alt: 'Estudio de tatuajes en sesión',
};
