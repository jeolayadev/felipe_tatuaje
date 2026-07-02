import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { ARTIST_PASSCODE } from '../../hooks/useArtistAuth';
import { AmbientBg } from '../ui/AmbientBg';
import { EASE } from '../../utils/motion';
import styles from './ArtistLogin.module.scss';

type ArtistLoginProps = {
  onSubmit: (code: string) => boolean;
  onBack: () => void;
};

export const ArtistLogin = ({ onSubmit, onBack }: ArtistLoginProps) => {
  const [code, setCode] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ok = onSubmit(code);
    if (!ok) {
      setError(true);
      setCode('');
    }
  };

  return (
    <section className={styles.login}>
      <AmbientBg variant="contact" />

      <motion.form
        className={styles.card}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <span className={styles.lock} aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" />
            <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            <path d="M12 14.5v3" />
          </svg>
        </span>

        <p className={styles.eyebrow}>Panel privado</p>
        <h1 className={styles.brand}>
          <em>{BRAND.logoA}</em>
          {BRAND.logoB}
        </h1>
        <h2 className={styles.title}>Acceso tatuador</h2>
        <p className={styles.lead}>
          Esta área gobierna la agenda, las reservas y los clientes. Ingresa tu clave para continuar.
        </p>

        <label className={styles.field}>
          Clave de acceso
          <div className={styles.inputWrap}>
            <input
              type={show ? 'text' : 'password'}
              value={code}
              autoFocus
              autoComplete="off"
              placeholder="••••••••"
              onChange={(event) => {
                setCode(event.target.value);
                if (error) setError(false);
              }}
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShow((prev) => !prev)}
              aria-label={show ? 'Ocultar clave' : 'Mostrar clave'}
            >
              {show ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>

        <div className={styles.feedback} aria-live="polite">
          {error && <span className={styles.error}>Clave incorrecta. Intenta nuevamente.</span>}
        </div>

        <button type="submit" className={styles.submit}>
          Entrar al panel
        </button>

        <button type="button" className={styles.back} onClick={onBack}>
          ← Volver a la vista cliente
        </button>

        <p className={styles.demo}>
          Versión beta de demostración · clave: <strong>{ARTIST_PASSCODE}</strong>
          <small>El acceso real con cuentas y roles llegará con Firebase Authentication.</small>
        </p>
      </motion.form>
    </section>
  );
};

export default ArtistLogin;
