/**
 * Contenido real del estudio Inkepilef.
 * Textos resumidos a lo esencial: la pagina no debe saturar con parrafos
 * largos; los detalles se muestran en tarjetas y carruseles compactos.
 */

export const STUDIO_STORY =
  'Estudio de tatuajes en Santiago dedicado a piezas únicas y personalizadas. ' +
  'Especialistas en negro y grises: realismo, blackwork, fine line y tradicional, ' +
  'con estrictos estándares de higiene y acompañamiento desde el diseño hasta la cicatrización.';

export const MILESTONES = [
  'Tatuador desde 2018',
  '+7 años de experiencia',
  'Santiago Centro · Malls · Iquique',
  'Solo con cita privada',
] as const;

export const BOOKING_POLICY = [
  {
    title: 'Abono de $15.000',
    detail: 'Reserva tu cupo con un abono mínimo que se descuenta del valor total del tatuaje.',
  },
  {
    title: 'Cambios con 3 días',
    detail: 'Puedes mover tu cita avisando con al menos 3 días de anticipación; de lo contrario el abono no se reembolsa.',
  },
  {
    title: 'Sesiones de 1 a 3 h',
    detail: 'Duración aproximada según el diseño. Solo se atiende con reserva anticipada.',
  },
] as const;

/** Protocolo de cuidados con Aquaphor, resumido en 6 pasos. */
export const AFTERCARE_STEPS = [
  {
    title: 'Primeras horas',
    detail:
      'Mantén el vendaje el tiempo indicado. Al retirarlo, lava con agua tibia y jabón neutro, y seca con toques suaves — sin frotar.',
  },
  {
    title: 'Aplica Aquaphor',
    detail:
      'Con manos limpias, una capa muy fina 2 a 3 veces al día durante los primeros 3 a 5 días. Piel hidratada, no brillante.',
  },
  {
    title: 'Descamación',
    detail:
      'Cuando comience a pelarse, cambia a una crema hidratante sin perfume hasta completar la cicatrización (2 a 4 semanas).',
  },
  {
    title: 'Mientras cicatriza',
    detail:
      'Lava 2 a 3 veces al día. No rasques ni retires costras ni piel que se desprenda. Usa ropa limpia y holgada.',
  },
  {
    title: 'Evita',
    detail:
      'Sol directo, piscinas, mar y jacuzzis hasta cicatrizar. Nada de alcohol, agua oxigenada ni productos perfumados.',
  },
  {
    title: 'Señales de alerta',
    detail:
      'Un leve enrojecimiento es normal. Ante dolor intenso, pus, mal olor o fiebre, consulta a un profesional de la salud.',
  },
] as const;
