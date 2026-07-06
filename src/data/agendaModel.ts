/**
 * Modelo de datos de la agenda (compartido entre la UI y la capa de datos).
 * Extraído de Agenda.tsx para que los hooks de Firestore y el componente usen
 * los mismos tipos sin dependencias circulares.
 */
export type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type DayConfig = {
  enabled: boolean;
  start: string;
  end: string;
};

export type Schedule = {
  slotMinutes: number;
  days: Record<WeekdayKey, DayConfig>;
  blockedDates: string[];
};

export type Booking = {
  id: string;
  date: string;
  time: string;
  name: string;
  contact: string;
  email?: string;
  phoneNumber?: string;
  bloodType?: string;
  idea: string;
  notes?: string;
  createdAt: string;
};

export const DEFAULT_SCHEDULE: Schedule = {
  slotMinutes: 90,
  days: {
    monday: { enabled: false, start: '14:00', end: '20:00' },
    tuesday: { enabled: true, start: '14:00', end: '20:00' },
    wednesday: { enabled: true, start: '14:00', end: '20:00' },
    thursday: { enabled: true, start: '14:00', end: '20:00' },
    friday: { enabled: true, start: '14:00', end: '20:00' },
    saturday: { enabled: true, start: '12:00', end: '18:00' },
    sunday: { enabled: false, start: '12:00', end: '18:00' },
  },
  blockedDates: [],
};

export const SCHEDULE_STORAGE_KEY = 'inkepilef-schedule-v1';
export const BOOKINGS_STORAGE_KEY = 'inkepilef-bookings-v1';
