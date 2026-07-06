import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';
import {
  type Schedule,
  type Booking,
  DEFAULT_SCHEDULE,
  SCHEDULE_STORAGE_KEY,
  BOOKINGS_STORAGE_KEY,
} from '../data/agendaModel';

/* ---------- Helpers de almacenamiento local (fallback beta) ---------- */
const readLocal = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeLocal = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* noop */
  }
};

const newId = () =>
  (window.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);

/* ---------- Horario (documento único config/schedule) ---------- */
export const useSchedule = () => {
  const [schedule, setScheduleState] = useState<Schedule>(() =>
    readLocal(SCHEDULE_STORAGE_KEY, DEFAULT_SCHEDULE)
  );
  const ref = useRef(schedule);
  useEffect(() => {
    ref.current = schedule;
  }, [schedule]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsub = onSnapshot(
      doc(db, 'config', 'schedule'),
      (snap) => {
        if (snap.exists()) setScheduleState(snap.data() as Schedule);
      },
      () => {
        /* sin permiso / offline: se mantiene el valor actual */
      }
    );
    return unsub;
  }, []);

  const setSchedule: Dispatch<SetStateAction<Schedule>> = useCallback((update) => {
    const next =
      typeof update === 'function'
        ? (update as (prev: Schedule) => Schedule)(ref.current)
        : update;
    ref.current = next;
    setScheduleState(next);
    if (isFirebaseConfigured && db) {
      setDoc(doc(db, 'config', 'schedule'), next).catch(() => {});
    } else {
      writeLocal(SCHEDULE_STORAGE_KEY, next);
    }
  }, []);

  return [schedule, setSchedule] as const;
};

/* ---------- Reservas (colección bookings) ---------- */
export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>(() =>
    readLocal<Booking[]>(BOOKINGS_STORAGE_KEY, [])
  );

  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;
    const unsub = onSnapshot(
      collection(db, 'bookings'),
      (snap) => {
        setBookings(
          snap.docs.map((d) => ({ ...(d.data() as Omit<Booking, 'id'>), id: d.id }))
        );
      },
      () => {}
    );
    return unsub;
  }, []);

  const addBooking = useCallback(async (booking: Omit<Booking, 'id'>): Promise<boolean> => {
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'bookings'), booking);
        return true;
      } catch {
        return false;
      }
    }
    setBookings((prev) => {
      const next = [...prev, { ...booking, id: newId() }];
      writeLocal(BOOKINGS_STORAGE_KEY, next);
      return next;
    });
    return true;
  }, []);

  const removeBooking = useCallback(async (id: string): Promise<void> => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
      } catch {
        /* noop */
      }
      return;
    }
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      writeLocal(BOOKINGS_STORAGE_KEY, next);
      return next;
    });
  }, []);

  return { bookings, addBooking, removeBooking };
};
