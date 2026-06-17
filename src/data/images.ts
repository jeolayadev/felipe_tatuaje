/**
 * Solo fotos de TATUAJES verificadas (Unsplash)
 * Sin joyería ni imágenes ajenas al rubro
 */

const unsplash = (id: string, w = 1200, h = 1500) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=90`;

export const BG_WALLPAPER = './bg-wallpaper.jpg';

const BASE = (import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/felipe_tatuaje/';

/** Trabajos japoneses — cada URL es sesión o pieza de tatuaje real */
export const JAPANESE_WORKS_HD = [
  {
    id: 1,
    titulo: 'Dragón irezumi',
    categoria: 'Dragón',
    estilo: 'Japonés' as const,
    src: `${BASE}gallery/web/1.jpg`,
    alt: 'Tatuaje japonés de dragón en el brazo',
  },
  {
    id: 2,
    titulo: 'Espalda japonesa',
    categoria: 'Espalda',
    estilo: 'Japonés' as const,
    src: `${BASE}gallery/web/2.jpg`,
    alt: 'Gran tatuaje japonés en la espalda',
  },
  {
    id: 3,
    titulo: 'Sesión en brazo',
    categoria: 'Irezumi',
    estilo: 'Japonés' as const,
    src: `${BASE}gallery/web/3.jpg`,
    alt: 'Tatuaje irezumi japonés en el brazo',
  },
  {
    id: 4,
    titulo: 'Girasol antebrazo',
    categoria: 'Antebrazo',
    estilo: 'Japonés' as const,
    src: `${BASE}gallery/web/4-TOP-4-Tatuajes-en-el-Antebrazo-Girasol-Realista-con-Ramas-Hojas-Pajaros-Golondrinas-en-Negro.jpg`,
    alt: 'Tatuaje girasol realista en antebrazo',
  },
  {
    id: 5,
    titulo: 'Detalle estudio',
    categoria: 'Detalle',
    estilo: 'Japonés' as const,
    src: `${BASE}gallery/web/4c92b8553bc6c61b2f68658120c95873.jpg`,
    alt: 'Detalle de sesión de tatuaje en estudio',
  },
  {
    id: 6,
    titulo: 'Dragón espalda',
    categoria: 'Espalda',
    estilo: 'Japonés' as const,
    src: `${BASE}gallery/web/Japanese-Dragon-Back-Tattoo-774x960.jpg`,
    alt: 'Gran tatuaje de dragón en la espalda',
  },
  {
    id: 7,
    titulo: 'Tatuaje de fénix',
    categoria: 'Fénix',
    estilo: 'Japonés' as const,
    src: unsplash('1599643478518-3a2cf6ef65b8'),
    alt: 'Tatuaje de fénix en llamas estilo japonés',
  },
  {
    id: 8,
    titulo: 'Onda grande',
    categoria: 'Naturaleza',
    estilo: 'Japonés' as const,
    src: unsplash('1598641926362-b8d2ce1cb881'),
    alt: 'Tatuaje de onda grande tradicional japonés',
  },
  {
    id: 9,
    titulo: 'Flor de cerezo',
    categoria: 'Floral',
    estilo: 'Japonés' as const,
    src: unsplash('1591362692343-dddde0b65b6e'),
    alt: 'Tatuaje de flor de cerezo en el cuello',
  },
  {
    id: 10,
    titulo: 'Máscara Noh',
    categoria: 'Cultural',
    estilo: 'Japonés' as const,
    src: unsplash('1590080876384-b86f473b1d3f'),
    alt: 'Tatuaje de máscara Noh tradicional',
  },
] as const;

export type JapaneseCategory = (typeof JAPANESE_WORKS_HD)[number]['categoria'];

export const PORTFOLIO_IMAGES = JAPANESE_WORKS_HD.slice(0, 6);

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
  'Neo-Tradicional': {
    src: unsplash('1599643478518-3a2cf6ef65b8'),
    alt: 'Tatuaje neo-tradicional con colores vibrantes',
  },
  Minimalista: {
    src: unsplash('1591362692343-dddde0b65b6e'),
    alt: 'Tatuaje minimalista en línea fina',
  },
  Acuarela: {
    src: unsplash('1598641926362-b8d2ce1cb881'),
    alt: 'Tatuaje de acuarela abstracta',
  },
  Dotwork: {
    src: unsplash('1590080876384-b86f473b1d3f'),
    alt: 'Tatuaje de puntos mandala',
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
