/**
 * Iconos de linea dibujados a mano para el panel del tatuador.
 * Estilo "flash" minimalista (trazo fino), sin emojis ni assets externos,
 * para que la vista tenga personalidad propia y coherente con la marca.
 * Usan currentColor: el color lo define la tarjeta segun la metrica.
 */
import type { SVGProps } from 'react';

const base: SVGProps<SVGSVGElement> = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  width: '100%',
  height: '100%',
  'aria-hidden': true,
};

/** Agenda / proximas citas — calendario con marca */
export const IconCalendar = () => (
  <svg {...base}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="M8.5 14.5l2 2 4-4.5" />
  </svg>
);

/** Cupos libres — reloj/aguja */
export const IconClock = () => (
  <svg {...base}>
    <circle cx="12" cy="12.5" r="8" />
    <path d="M12 8.5v4.5l3 2" />
    <path d="M9 2.5h6" />
  </svg>
);

/** Clientes — dos siluetas */
export const IconClients = () => (
  <svg {...base}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3.5 20c0-3.3 2.5-5.8 5.5-5.8s5.5 2.5 5.5 5.8" />
    <path d="M16 5.4a3.2 3.2 0 0 1 0 6.2M17 14.6c2.4.6 4 2.8 4 5.4" />
  </svg>
);

/** Dias activos — aguja de tatuar / energia */
export const IconNeedle = () => (
  <svg {...base}>
    <path d="M21 3l-9.5 9.5" />
    <path d="M14.5 5.5l4 4" />
    <path d="M11.5 12.5l-1.8 1.8a3 3 0 1 0 .8.8L12.3 13.3" />
    <circle cx="7.5" cy="16.5" r="1" />
  </svg>
);
