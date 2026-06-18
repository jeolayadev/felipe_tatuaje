import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { EASE } from '../../utils/motion';
import { ClientCard } from '../ui/ClientCard';
import { DashboardMetrics } from '../ui/DashboardMetrics';
import { ReminderPanel } from '../ui/ReminderPanel';
import styles from './Agenda.module.scss';

export type ViewMode = 'cliente' | 'tatuador';

type WeekdayKey =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

type DayConfig = {
  enabled: boolean;
  start: string;
  end: string;
};

type Schedule = {
  slotMinutes: number;
  days: Record<WeekdayKey, DayConfig>;
  blockedDates: string[];
};

type Booking = {
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

type SlotStatus = 'available' | 'booked' | 'past';

type TimeSlot = {
  time: string;
  status: SlotStatus;
};

type ArtistPanel = 'gobernar' | 'gestionar' | 'reservas' | 'usuarios';

type ClientSummary = {
  name: string;
  contact: string;
  email?: string;
  phoneNumber?: string;
  bloodType?: string;
  bookingsCount: number;
  lastIdea: string;
  nextBooking?: Booking;
  notes?: string;
};

type Reminder = {
  id: string;
  clientName: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'warning';
  daysUntil?: number;
};

type AgendaProps = {
  viewMode: ViewMode;
};

const SCHEDULE_STORAGE_KEY = 'noir-ink-schedule-v1';
const BOOKINGS_STORAGE_KEY = 'noir-ink-bookings-v1';

const WEEKDAYS: Array<{ key: WeekdayKey; label: string; short: string; jsDay: number }> = [
  { key: 'monday', label: 'Lunes', short: 'Lun', jsDay: 1 },
  { key: 'tuesday', label: 'Martes', short: 'Mar', jsDay: 2 },
  { key: 'wednesday', label: 'Miercoles', short: 'Mie', jsDay: 3 },
  { key: 'thursday', label: 'Jueves', short: 'Jue', jsDay: 4 },
  { key: 'friday', label: 'Viernes', short: 'Vie', jsDay: 5 },
  { key: 'saturday', label: 'Sabado', short: 'Sab', jsDay: 6 },
  { key: 'sunday', label: 'Domingo', short: 'Dom', jsDay: 0 },
];

const DEFAULT_SCHEDULE: Schedule = {
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

const BOOKING_INITIAL = {
  name: '',
  contact: '',
  email: '',
  phoneNumber: '',
  bloodType: '',
  idea: '',
  notes: '',
};

const readStoredValue = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

const useStoredState = <T,>(key: string, fallback: T) => {
  const [state, setState] = useState<T>(() => readStoredValue(key, fallback));

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
};

const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateValue = (dateValue: string) => new Date(`${dateValue}T12:00:00`);

const getDateLabel = (dateValue: string) =>
  new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(parseDateValue(dateValue));

const getShortDateParts = (dateValue: string) => {
  const date = parseDateValue(dateValue);
  return {
    day: new Intl.DateTimeFormat('es-CL', { weekday: 'short' }).format(date),
    number: new Intl.DateTimeFormat('es-CL', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('es-CL', { month: 'short' }).format(date),
  };
};

const getUpcomingDates = (amount: number) => {
  const today = new Date();

  return Array.from({ length: amount }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return formatDateValue(date);
  });
};

const getWeekdayMeta = (dateValue: string) => {
  const day = parseDateValue(dateValue).getDay();
  return WEEKDAYS.find((weekday) => weekday.jsDay === day) ?? WEEKDAYS[0];
};

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const toTimeValue = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
};

const isPastSlot = (dateValue: string, time: string) => new Date(`${dateValue}T${time}:00`) <= new Date();

const getSlotsForDate = (dateValue: string, schedule: Schedule, bookings: Booking[]): TimeSlot[] => {
  const weekday = getWeekdayMeta(dateValue);
  const config = schedule.days[weekday.key];

  if (!config.enabled || schedule.blockedDates.includes(dateValue)) return [];

  const start = toMinutes(config.start);
  const end = toMinutes(config.end);
  const bookedTimes = new Set(
    bookings.filter((booking) => booking.date === dateValue).map((booking) => booking.time)
  );

  if (start >= end || schedule.slotMinutes <= 0) return [];

  const slots: TimeSlot[] = [];

  for (let current = start; current + schedule.slotMinutes <= end; current += schedule.slotMinutes) {
    const time = toTimeValue(current);
    const status = bookedTimes.has(time) ? 'booked' : isPastSlot(dateValue, time) ? 'past' : 'available';
    slots.push({ time, status });
  }

  return slots;
};

const getBookingDateTime = (booking: Booking) =>
  `${getDateLabel(booking.date)} a las ${booking.time}`;

const getBookingTimestamp = (booking: Booking) =>
  new Date(`${booking.date}T${booking.time}:00`).getTime();

const ARTIST_ACTIONS: Array<{ panel: ArtistPanel; label: string; detail: string }> = [
  { panel: 'gobernar', label: 'Gobernar agenda', detail: 'Horarios y cierres' },
  { panel: 'gestionar', label: 'Gestionar reservas', detail: 'Acciones rapidas' },
  { panel: 'reservas', label: 'Ver reservas', detail: 'Listado completo' },
  { panel: 'usuarios', label: 'Ver usuarios', detail: 'Clientes agendados' },
];

export const Agenda = ({ viewMode }: AgendaProps) => {
  const [schedule, setSchedule] = useStoredState<Schedule>(SCHEDULE_STORAGE_KEY, DEFAULT_SCHEDULE);
  const [bookings, setBookings] = useStoredState<Booking[]>(BOOKINGS_STORAGE_KEY, []);
  const dates = useMemo(() => getUpcomingDates(28), []);

  return viewMode === 'tatuador' ? (
    <ArtistAgenda
      schedule={schedule}
      setSchedule={setSchedule}
      bookings={bookings}
      setBookings={setBookings}
      dates={dates}
    />
  ) : (
    <ClientAgenda
      schedule={schedule}
      bookings={bookings}
      setBookings={setBookings}
      dates={dates}
    />
  );
};

type ArtistAgendaProps = {
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  dates: string[];
};

const ArtistAgenda = ({ schedule, setSchedule, bookings, setBookings, dates }: ArtistAgendaProps) => {
  const [activePanel, setActivePanel] = useState<ArtistPanel>('gobernar');
  const [blockedDate, setBlockedDate] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [now] = useState(() => Date.now());
  const today = dates[0];
  const orderedBookings = useMemo(
    () =>
      [...bookings].sort((a, b) => {
        return getBookingTimestamp(a) - getBookingTimestamp(b);
      }),
    [bookings]
  );

  const availableSummary = useMemo(
    () =>
      dates.map((dateValue) => {
        const slots = getSlotsForDate(dateValue, schedule, bookings);

        return {
          date: dateValue,
          available: slots.filter((slot) => slot.status === 'available').length,
          booked: slots.filter((slot) => slot.status === 'booked').length,
        };
      }),
    [bookings, dates, schedule]
  );

  const upcomingBookings = useMemo(
    () => orderedBookings.filter((booking) => getBookingTimestamp(booking) >= now),
    [now, orderedBookings]
  );

  const todayBookings = useMemo(
    () => orderedBookings.filter((booking) => booking.date === today),
    [orderedBookings, today]
  );

  const clients = useMemo(() => {
    const clientMap = new Map<string, ClientSummary>();

    orderedBookings.forEach((booking) => {
      const key = booking.contact.trim().toLowerCase() || booking.name.trim().toLowerCase();
      const current = clientMap.get(key);

      if (!current) {
        clientMap.set(key, {
          name: booking.name,
          contact: booking.contact,
          email: booking.email,
          phoneNumber: booking.phoneNumber,
          bloodType: booking.bloodType,
          bookingsCount: 1,
          lastIdea: booking.idea,
          notes: booking.notes,
          nextBooking: getBookingTimestamp(booking) >= now ? booking : undefined,
        });
        return;
      }

      current.bookingsCount += 1;
      current.lastIdea = booking.idea;
      if (!current.nextBooking && getBookingTimestamp(booking) >= now) {
        current.nextBooking = booking;
      }
    });

    return Array.from(clientMap.values()).sort((a, b) => b.bookingsCount - a.bookingsCount);
  }, [now, orderedBookings]);

  const [dismissedReminders, setDismissedReminders] = useState<Set<string>>(new Set());

  const workingDays = WEEKDAYS.filter((weekday) => schedule.days[weekday.key].enabled).length;

  const reminders = useMemo(() => {
    const reminderList: Reminder[] = [];

    // Recordatorios de citas próximas
    todayBookings.forEach((booking) => {
      const key = `today-${booking.id}`;
      if (!dismissedReminders.has(key)) {
        reminderList.push({
          id: key,
          clientName: booking.name,
          message: `Cita programada a las ${booking.time}`,
          time: booking.time,
          type: 'alert',
        });
      }
    });

    // Recordatorios de próximas citas (24 horas)
    upcomingBookings.slice(0, 2).forEach((booking) => {
      const bookingDate = new Date(`${booking.date}T${booking.time}:00`);
      const now = new Date();
      const hoursUntil = (bookingDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursUntil <= 24 && hoursUntil > 0) {
        const key = `upcoming-${booking.id}`;
        if (!dismissedReminders.has(key)) {
          reminderList.push({
            id: key,
            clientName: booking.name,
            message: `Cita mañana a las ${booking.time}`,
            time: booking.time,
            type: 'info',
          });
        }
      }
    });

    return reminderList;
  }, [todayBookings, upcomingBookings, dismissedReminders]);

  const handleDismissReminder = (id: string) => {
    setDismissedReminders((prev) => new Set([...prev, id]));
  };
  const availableNextWeek = availableSummary
    .slice(0, 7)
    .reduce((total, item) => total + item.available, 0);
  const bookedNextWeek = availableSummary.slice(0, 7).reduce((total, item) => total + item.booked, 0);

  const updateDay = (key: WeekdayKey, value: Partial<DayConfig>) => {
    setSchedule((current) => ({
      ...current,
      days: {
        ...current.days,
        [key]: {
          ...current.days[key],
          ...value,
        },
      },
    }));
  };

  const addBlockedDate = () => {
    if (!blockedDate) return;

    setSchedule((current) => {
      if (current.blockedDates.includes(blockedDate)) return current;

      return {
        ...current,
        blockedDates: [...current.blockedDates, blockedDate].sort(),
      };
    });
    setBlockedDate('');
  };

  const removeBlockedDate = (dateValue: string) => {
    setSchedule((current) => ({
      ...current,
      blockedDates: current.blockedDates.filter((item) => item !== dateValue),
    }));
  };

  const removeBooking = (bookingId: string) => {
    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
  };

  const saveSchedule = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaveMessage('Horario guardado para clientes.');
    window.setTimeout(() => setSaveMessage(''), 2600);
  };

  return (
    <section id="agenda-tatuador" className={`${styles.section} ${styles.artistSection}`}>
      <div className={styles.wrap}>
        <motion.header
          className={styles.artistHero}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div className={styles.artistHeroCopy}>
            <p className={styles.eyebrow}>Vista tatuador</p>
            <h2>Gobernar agenda</h2>
            <p>
              Controla disponibilidad, reservas y clientes desde un panel pensado para operar el dia.
            </p>
            <div className={styles.artistActions}>
              {ARTIST_ACTIONS.map((action) => (
                <button
                  key={action.panel}
                  type="button"
                  className={activePanel === action.panel ? styles.actionActive : ''}
                  onClick={() => setActivePanel(action.panel)}
                >
                  <strong>{action.label}</strong>
                  <span>{action.detail}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.heroMetrics}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <DashboardMetrics
                metrics={[
                  {
                    label: 'Proximas citas',
                    value: upcomingBookings.length,
                    subvalue: `${todayBookings.length} hoy`,
                    icon: '📅',
                    trend: upcomingBookings.length > 5 ? 'up' : 'neutral',
                    color: 'gold',
                  },
                  {
                    label: 'Cupos libres',
                    value: availableNextWeek,
                    subvalue: 'en 7 días',
                    icon: '⏰',
                    trend: availableNextWeek > 10 ? 'up' : 'down',
                    color: 'blue',
                  },
                  {
                    label: 'Clientes',
                    value: clients.length,
                    subvalue: 'con reserva',
                    icon: '👥',
                    trend: clients.length > 0 ? 'up' : 'neutral',
                    color: 'green',
                  },
                  {
                    label: 'Dias activos',
                    value: workingDays,
                    subvalue: 'por semana',
                    icon: '🎯',
                    trend: 'neutral',
                    color: 'gold',
                  },
                ]}
              />
            </motion.div>
          </div>
        </motion.header>

        <div className={styles.artistDashboard}>
          <motion.main
            className={styles.artistMain}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {activePanel === 'gobernar' && (
              <form className={styles.panelCard} onSubmit={saveSchedule}>
                <div className={styles.panelHeader}>
                  <div>
                    <span>Control general</span>
                    <h3>Gobernar disponibilidad</h3>
                    <p>Define que dias trabajas, cuanto dura cada bloque y que fechas se cierran.</p>
                  </div>
                  <label className={styles.selectLabel}>
                    Duracion
                    <select
                      value={schedule.slotMinutes}
                      onChange={(event) =>
                        setSchedule((current) => ({
                          ...current,
                          slotMinutes: Number(event.target.value),
                        }))
                      }
                    >
                      <option value={60}>60 min</option>
                      <option value={90}>90 min</option>
                      <option value={120}>120 min</option>
                      <option value={180}>180 min</option>
                    </select>
                  </label>
                </div>

                <div className={styles.saveStatus} aria-live="polite">
                  {saveMessage}
                </div>

                <div className={styles.dayList}>
                  {WEEKDAYS.map((weekday) => {
                    const day = schedule.days[weekday.key];

                    return (
                      <article
                        key={weekday.key}
                        className={`${styles.dayRow} ${day.enabled ? styles.dayEnabled : ''}`}
                      >
                        <label className={styles.switchLabel}>
                          <input
                            type="checkbox"
                            checked={day.enabled}
                            onChange={(event) => updateDay(weekday.key, { enabled: event.target.checked })}
                          />
                          <span />
                          <strong>{weekday.label}</strong>
                        </label>

                        <div className={styles.timeGrid}>
                          <label>
                            Inicio
                            <input
                              type="time"
                              value={day.start}
                              disabled={!day.enabled}
                              onChange={(event) => updateDay(weekday.key, { start: event.target.value })}
                            />
                          </label>
                          <label>
                            Termino
                            <input
                              type="time"
                              value={day.end}
                              disabled={!day.enabled}
                              onChange={(event) => updateDay(weekday.key, { end: event.target.value })}
                            />
                          </label>
                        </div>

                        <span className={styles.dayStatus}>{day.enabled ? 'Trabaja' : 'No trabaja'}</span>
                      </article>
                    );
                  })}
                </div>

                <div className={styles.blockTools}>
                  <div>
                    <h3>Dias cerrados</h3>
                    <p>Bloquea feriados, viajes o sesiones privadas.</p>
                  </div>

                  <div className={styles.blockForm}>
                    <input
                      type="date"
                      min={today}
                      value={blockedDate}
                      onChange={(event) => setBlockedDate(event.target.value)}
                    />
                    <button type="button" onClick={addBlockedDate}>
                      Bloquear
                    </button>
                  </div>

                  <div className={styles.blockedList}>
                    {schedule.blockedDates.length === 0 ? (
                      <span className={styles.emptyInline}>Sin dias bloqueados</span>
                    ) : (
                      schedule.blockedDates.map((dateValue) => (
                        <button key={dateValue} type="button" onClick={() => removeBlockedDate(dateValue)}>
                          {getDateLabel(dateValue)}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <button type="submit" className={styles.saveButton}>
                  Guardar horario
                </button>
              </form>
            )}

            {activePanel === 'gestionar' && (
              <section className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <span>Operacion</span>
                    <h3>Gestionar reservas</h3>
                    <p>Revisa las citas mas cercanas, contacta clientes o libera un bloque.</p>
                  </div>
                  <button type="button" className={styles.ghostButton} onClick={() => setActivePanel('gobernar')}>
                    Ajustar horario
                  </button>
                </div>

                {upcomingBookings.length === 0 ? (
                  <p className={styles.empty}>No hay reservas proximas para gestionar.</p>
                ) : (
                  <div className={styles.manageList}>
                    {upcomingBookings.slice(0, 6).map((booking) => (
                      <article key={booking.id} className={styles.manageCard}>
                        <div className={styles.manageDate}>
                          <strong>{booking.time}</strong>
                          <span>{getShortDateParts(booking.date).day}</span>
                          <small>{getShortDateParts(booking.date).number}</small>
                        </div>
                        <div>
                          <h4>{booking.name}</h4>
                          <p>{booking.idea}</p>
                          <a href={`mailto:${booking.contact}`}>{booking.contact}</a>
                        </div>
                        <button type="button" onClick={() => removeBooking(booking.id)}>
                          Liberar
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activePanel === 'reservas' && (
              <section id="reservas-tatuador" className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <span>Listado</span>
                    <h3>Ver reservas</h3>
                    <p>Todas las reservas guardadas en este calendario.</p>
                  </div>
                  <strong className={styles.panelCount}>{orderedBookings.length}</strong>
                </div>

                {orderedBookings.length === 0 ? (
                  <p className={styles.empty}>No hay reservas activas.</p>
                ) : (
                  <div className={styles.bookingList}>
                    {orderedBookings.map((booking) => (
                      <article key={booking.id} className={styles.bookingCard}>
                        <div>
                          <span>{getBookingDateTime(booking)}</span>
                          <h4>{booking.name}</h4>
                          <p>{booking.idea}</p>
                          <a href={`mailto:${booking.contact}`}>{booking.contact}</a>
                        </div>
                        <button type="button" onClick={() => removeBooking(booking.id)}>
                          Cancelar
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activePanel === 'usuarios' && (
              <section id="usuarios-tatuador" className={styles.panelCard}>
                <div className={styles.panelHeader}>
                  <div>
                    <span>Clientes</span>
                    <h3>Ver usuarios</h3>
                    <p>Personas que han tomado horas en la agenda con sus datos de contacto.</p>
                  </div>
                  <strong className={styles.panelCount}>{clients.length}</strong>
                </div>

                {clients.length === 0 ? (
                  <p className={styles.empty}>Todavia no hay usuarios registrados por reservas.</p>
                ) : (
                  <div className={styles.clientsGrid}>
                    {clients.map((client) => (
                      <ClientCard
                        key={client.contact}
                        client={{
                          name: client.name,
                          contact: client.contact,
                          email: client.email,
                          phoneNumber: client.phoneNumber,
                          bloodType: client.bloodType,
                          bookingsCount: client.bookingsCount,
                          lastIdea: client.lastIdea,
                          nextBooking: client.nextBooking
                            ? {
                                date: client.nextBooking.date,
                                time: client.nextBooking.time,
                              }
                            : undefined,
                          notes: client.notes,
                        }}
                        variant="full"
                        onEdit={() => {
                          // Aquí se puede abrir un modal para editar
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </motion.main>

          <motion.aside
            className={styles.insightRail}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          >
            <div className={styles.reminderSection}>
              <ReminderPanel
                reminders={reminders}
                title="Recordatorios"
                onDismiss={handleDismissReminder}
              />
            </div>

            <div className={styles.nextPanel}>
              <div className={styles.reservationsHeader}>
                <h3>Proximas citas</h3>
                <span>{upcomingBookings.length}</span>
              </div>

              {upcomingBookings.length === 0 ? (
                <p className={styles.empty}>Sin citas proximas.</p>
              ) : (
                <div className={styles.timeline}>
                  {upcomingBookings.slice(0, 5).map((booking) => (
                    <article key={booking.id}>
                      <span>{booking.time}</span>
                      <div>
                        <strong>{booking.name}</strong>
                        <small>{getDateLabel(booking.date)}</small>
                        <p>{booking.idea}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.preview}>
              <div className={styles.reservationsHeader}>
                <h3>Calendario</h3>
                <span>{bookedNextWeek} tomadas</span>
              </div>
              <div className={styles.previewGrid}>
                {availableSummary.slice(0, 14).map((item) => {
                  const parts = getShortDateParts(item.date);

                  return (
                    <div
                      key={item.date}
                      className={`${styles.previewDay} ${item.booked > 0 ? styles.previewBooked : ''}`}
                    >
                      <span>{parts.day}</span>
                      <strong>{parts.number}</strong>
                      <small>{item.available} libres</small>
                      {item.booked > 0 && <em>{item.booked} cita</em>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.nextPanel}>
              <div className={styles.reservationsHeader}>
                <h3>Hoy</h3>
                <span>{todayBookings.length}</span>
              </div>
              {todayBookings.length === 0 ? (
                <p className={styles.empty}>No hay citas para hoy.</p>
              ) : (
                <div className={styles.todayList}>
                  {todayBookings.map((booking) => (
                    <article key={booking.id}>
                      <strong>{booking.time}</strong>
                      <span>{booking.name}</span>
                      <small>{booking.idea}</small>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};

type ClientAgendaProps = {
  schedule: Schedule;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  dates: string[];
};

const ClientAgenda = ({ schedule, bookings, setBookings, dates }: ClientAgendaProps) => {
  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingForm, setBookingForm] = useState(BOOKING_INITIAL);
  const [success, setSuccess] = useState('');

  const selectedSlots = useMemo(
    () => getSlotsForDate(selectedDate, schedule, bookings),
    [bookings, schedule, selectedDate]
  );

  const dateCards = useMemo(
    () =>
      dates.map((dateValue) => {
        const slots = getSlotsForDate(dateValue, schedule, bookings);
        return {
          date: dateValue,
          parts: getShortDateParts(dateValue),
          available: slots.filter((slot) => slot.status === 'available').length,
        };
      }),
    [bookings, dates, schedule]
  );

  const selectedSlotAvailable = selectedSlots.some(
    (slot) => slot.time === selectedSlot && slot.status === 'available'
  );

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedSlotAvailable) return;

    const nextBooking: Booking = {
      id: window.crypto?.randomUUID?.() ?? `${Date.now()}-${selectedDate}-${selectedSlot}`,
      date: selectedDate,
      time: selectedSlot,
      name: bookingForm.name.trim(),
      contact: bookingForm.contact.trim(),
      email: bookingForm.email?.trim(),
      phoneNumber: bookingForm.phoneNumber?.trim(),
      bloodType: bookingForm.bloodType?.trim(),
      idea: bookingForm.idea.trim(),
      notes: bookingForm.notes?.trim(),
      createdAt: new Date().toISOString(),
    };

    setBookings((current) => [...current, nextBooking]);
    setSuccess(`Reserva tomada para ${getDateLabel(selectedDate)} a las ${selectedSlot}.`);
    setBookingForm(BOOKING_INITIAL);
    setSelectedSlot('');
    window.setTimeout(() => setSuccess(''), 4200);
  };

  return (
    <section id="agenda-clientes" className={styles.section}>
      <div className={styles.wrap}>
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <p className={styles.eyebrow}>Vista cliente</p>
          <h2>Agenda tu hora</h2>
          <p>{BRAND.location} - cupos segun disponibilidad del tatuador.</p>
        </motion.header>

        <div className={styles.clientGrid}>
          <motion.div
            className={styles.calendarArea}
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <p className={styles.dateHint} aria-hidden>
              Desliza para ver más fechas <span>→</span>
            </p>
            <div className={styles.dateGrid}>
              {dateCards.map((item) => (
                <button
                  key={item.date}
                  type="button"
                  className={`${styles.dateButton} ${
                    item.date === selectedDate ? styles.dateActive : ''
                  } ${item.available === 0 ? styles.dateUnavailable : ''}`}
                  onClick={() => {
                    setSelectedDate(item.date);
                    setSelectedSlot('');
                  }}
                >
                  <span>{item.parts.day}</span>
                  <strong>{item.parts.number}</strong>
                  <small>{item.parts.month}</small>
                  <em>{item.available} cupos</em>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className={styles.bookingArea}
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          >
            <div className={styles.slotHeader}>
              <h3>{getDateLabel(selectedDate)}</h3>
              <span>{selectedSlots.filter((slot) => slot.status === 'available').length} disponibles</span>
            </div>

            {selectedSlots.length === 0 ? (
              <p className={styles.empty}>El tatuador no atiende este dia.</p>
            ) : (
              <div className={styles.slotGrid}>
                {selectedSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={slot.status !== 'available'}
                    className={`${styles.slotButton} ${
                      selectedSlotAvailable && selectedSlot === slot.time ? styles.slotActive : ''
                    } ${slot.status === 'booked' ? styles.slotBooked : ''} ${
                      slot.status === 'past' ? styles.slotPast : ''
                    }`}
                    onClick={() => setSelectedSlot(slot.time)}
                  >
                    <strong>{slot.time}</strong>
                    <span>
                      {slot.status === 'available'
                        ? 'Disponible'
                        : slot.status === 'booked'
                          ? 'Reservado'
                          : 'Pasado'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <form className={styles.clientForm} onSubmit={submitBooking}>
              <div className={styles.formGrid}>
                <label>
                  Nombre
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(event) => setBookingForm({ ...bookingForm, name: event.target.value })}
                    placeholder="Tu nombre completo"
                  />
                </label>
                <label>
                  Teléfono
                  <input
                    type="tel"
                    value={bookingForm.phoneNumber}
                    onChange={(event) => setBookingForm({ ...bookingForm, phoneNumber: event.target.value })}
                    placeholder="+56 9 1234 5678"
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={bookingForm.email}
                    onChange={(event) => setBookingForm({ ...bookingForm, email: event.target.value })}
                    placeholder="tu@email.com"
                  />
                </label>
                <label>
                  Contacto (requerido)
                  <input
                    type="text"
                    required
                    value={bookingForm.contact}
                    onChange={(event) => setBookingForm({ ...bookingForm, contact: event.target.value })}
                    placeholder="Teléfono o email"
                  />
                </label>
                <label>
                  Tipo de sangre
                  <select
                    value={bookingForm.bloodType || ''}
                    onChange={(event) => setBookingForm({ ...bookingForm, bloodType: event.target.value })}
                  >
                    <option value="">Seleccionar</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </label>
                <label className={styles.fullField}>
                  Idea del tatuaje
                  <textarea
                    required
                    rows={3}
                    value={bookingForm.idea}
                    onChange={(event) => setBookingForm({ ...bookingForm, idea: event.target.value })}
                    placeholder="Estilo, zona, tamaño aproximado"
                  />
                </label>
                <label className={styles.fullField}>
                  Notas adicionales
                  <textarea
                    rows={2}
                    value={bookingForm.notes}
                    onChange={(event) => setBookingForm({ ...bookingForm, notes: event.target.value })}
                    placeholder="Alergias, medicamentos, etc (opcional)"
                  />
                </label>
              </div>
              <button type="submit" disabled={!selectedSlotAvailable}>
                Reservar {selectedSlotAvailable ? selectedSlot : 'hora'}
              </button>
              <div className={styles.success} aria-live="polite">
                {success}
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Agenda;
