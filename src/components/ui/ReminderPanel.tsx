import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReminderPanel.module.scss';

interface Reminder {
  id: string;
  clientName: string;
  message: string;
  time: string;
  type: 'alert' | 'info' | 'warning';
  daysUntil?: number;
}

interface ReminderPanelProps {
  reminders: Reminder[];
  title?: string;
  onDismiss?: (id: string) => void;
}

export const ReminderPanel = ({
  reminders,
  title = 'Recordatorios',
  onDismiss,
}: ReminderPanelProps) => {
  const typeIcons: Record<string, string> = {
    alert: '🔔',
    info: 'ℹ',
    warning: '⚠',
  };

  const typeColors: Record<string, string> = {
    alert: 'var(--color-alert, #d4af37)',
    info: 'var(--color-info, #3b82f6)',
    warning: 'var(--color-warning, #f59e0b)',
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>{title}</h3>
        {reminders.length > 0 && (
          <span className={styles.count}>{reminders.length}</span>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {reminders.length === 0 ? (
          <motion.div
            className={styles.empty}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>Sin recordatorios activos</span>
          </motion.div>
        ) : (
          <div className={styles.reminderList}>
            {reminders.map((reminder) => (
              <motion.article
                key={reminder.id}
                className={`${styles.reminder} ${styles[reminder.type]}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <span
                  className={styles.icon}
                  style={{ color: typeColors[reminder.type] }}
                >
                  {typeIcons[reminder.type]}
                </span>

                <div className={styles.content}>
                  <strong>{reminder.clientName}</strong>
                  <p>{reminder.message}</p>
                  <div className={styles.meta}>
                    <time>{reminder.time}</time>
                    {reminder.daysUntil !== undefined && (
                      <span className={styles.days}>
                        en {reminder.daysUntil} {reminder.daysUntil === 1 ? 'día' : 'días'}
                      </span>
                    )}
                  </div>
                </div>

                {onDismiss && (
                  <motion.button
                    className={styles.dismissBtn}
                    onClick={() => onDismiss(reminder.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Descartar recordatorio"
                  >
                    ✕
                  </motion.button>
                )}
              </motion.article>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
