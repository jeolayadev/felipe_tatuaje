import { motion } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import styles from './FloatingContact.module.scss';

/**
 * Botones flotantes de contacto rápido (WhatsApp + Instagram).
 * Fijos abajo a la derecha, presentes en toda la página.
 */
const waNumber = BRAND.phone.replace(/[^\d]/g, '');
const waText = encodeURIComponent(
  'Hola Inkepilef 👋 quiero consultar por un tatuaje / agendar una hora.'
);
const WHATSAPP_URL = `https://wa.me/${waNumber}?text=${waText}`;

export const FloatingContact = () => (
  <div className={styles.dock} aria-label="Contacto rápido">
    <motion.a
      href={BRAND.instagramUrl}
      target="_blank"
      rel="noreferrer"
      className={`${styles.btn} ${styles.ig}`}
      aria-label="Instagram de Inkepilef"
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.9, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
      </svg>
    </motion.a>

    <motion.a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      className={`${styles.btn} ${styles.wa}`}
      aria-label="Escríbenos por WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
    >
      <span className={styles.pulse} aria-hidden />
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.38a9.86 9.86 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.23-8.23 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43l-.48-.01c-.16 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
      </svg>
    </motion.a>
  </div>
);

export default FloatingContact;
