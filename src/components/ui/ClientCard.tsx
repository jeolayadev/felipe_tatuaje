import { motion } from 'framer-motion';
import styles from './ClientCard.module.scss';

interface ExtendedClient {
  name: string;
  contact: string;
  email?: string;
  phoneNumber?: string;
  bloodType?: string;
  bookingsCount: number;
  lastIdea: string;
  nextBooking?: {
    date: string;
    time: string;
  };
  totalSpent?: number;
  notes?: string;
}

interface ClientCardProps {
  client: ExtendedClient;
  variant?: 'compact' | 'full';
  onEdit?: (client: ExtendedClient) => void;
  onDelete?: (contact: string) => void;
}

export const ClientCard = ({
  client,
  variant = 'compact',
  onEdit,
  onDelete,
}: ClientCardProps) => {
  const initials = client.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const bloodColorMap: Record<string, string> = {
    'O+': '#ef4444',
    'O-': '#f87171',
    'A+': '#f59e0b',
    'A-': '#fbbf24',
    'B+': '#3b82f6',
    'B-': '#60a5fa',
    'AB+': '#8b5cf6',
    'AB-': '#a78bfa',
  };

  const bloodColor = client.bloodType ? bloodColorMap[client.bloodType] : '#6b7280';

  return (
    <motion.article
      className={`${styles.card} ${styles[variant]}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span>{initials}</span>
          {client.bloodType && (
            <div
              className={styles.blood}
              title={`Tipo de sangre: ${client.bloodType}`}
              style={{ backgroundColor: bloodColor }}
            >
              {client.bloodType}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <h4>{client.name}</h4>
          <p className={styles.contact}>{client.contact}</p>
        </div>
      </div>

      {variant === 'full' && (
        <>
          <div className={styles.details}>
            {client.email && (
              <div className={styles.detail}>
                <span>Email</span>
                <a href={`mailto:${client.email}`}>{client.email}</a>
              </div>
            )}
            {client.phoneNumber && (
              <div className={styles.detail}>
                <span>Teléfono</span>
                <a href={`tel:${client.phoneNumber}`}>{client.phoneNumber}</a>
              </div>
            )}
            <div className={styles.detail}>
              <span>Reservas</span>
              <strong>{client.bookingsCount}</strong>
            </div>
            {client.totalSpent && (
              <div className={styles.detail}>
                <span>Gasto</span>
                <strong>${client.totalSpent.toLocaleString('es-CL')}</strong>
              </div>
            )}
          </div>

          <div className={styles.lastWork}>
            <span>Último trabajo</span>
            <p>{client.lastIdea}</p>
          </div>

          {client.notes && (
            <div className={styles.notes}>
              <span>Notas</span>
              <p>{client.notes}</p>
            </div>
          )}
        </>
      )}

      <div className={styles.footer}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <strong>{client.bookingsCount}</strong>
            <em>citas</em>
          </span>
          {client.nextBooking && (
            <span className={styles.stat}>
              <em>Próxima</em>
              <strong>{client.nextBooking.time}</strong>
            </span>
          )}
        </div>

        {(onEdit || onDelete) && (
          <div className={styles.actions}>
            {onEdit && (
              <button
                type="button"
                className={styles.btnEdit}
                onClick={() => onEdit(client)}
                aria-label="Editar cliente"
              >
                ✎
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className={styles.btnDelete}
                onClick={() => onDelete(client.contact)}
                aria-label="Eliminar cliente"
              >
                ✕
              </button>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};
