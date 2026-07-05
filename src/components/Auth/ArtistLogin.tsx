import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { AmbientBg } from '../ui/AmbientBg';
import { EASE } from '../../utils/motion';
import styles from './ArtistLogin.module.scss';

type ArtistLoginProps = {
  onSubmit: (email: string, password: string) => Promise<string | null>;
  onBack: () => void;
};

export const ArtistLogin = ({ onSubmit, onBack }: ArtistLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    const result = await onSubmit(email, password);
    if (result) {
      setError(result);
      setPassword('');
    }
    setBusy(false);
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
          Ingresa con tu correo y contraseña para gobernar la agenda, las reservas y los clientes.
        </p>

        <label className={styles.field}>
          Correo
          <div className={styles.inputWrap}>
            <input
              type="email"
              value={email}
              autoComplete="username"
              placeholder="tu@correo.com"
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>
        </label>

        <label className={styles.field}>
          Contraseña
          <div className={styles.inputWrap}>
            <input
              type={show ? 'text' : 'password'}
              value={password}
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError('');
              }}
              required
            />
            <button
              type="button"
              className={styles.toggle}
              onClick={() => setShow((prev) => !prev)}
              aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {show ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </label>

        <div className={styles.feedback} aria-live="polite">
          {error && <span className={styles.error}>{error}</span>}
        </div>

        <button type="submit" className={styles.submit} disabled={busy}>
          {busy ? 'Ingresando…' : 'Entrar al panel'}
        </button>

        <button type="button" className={styles.back} onClick={onBack}>
          ← Volver a la vista cliente
        </button>

        <p className={styles.demo}>
          El acceso lo administra el estudio con Firebase Authentication.
          <small>¿Olvidaste tu contraseña? Se restablece desde la consola de Firebase.</small>
        </p>
      </motion.form>
    </section>
  );
};

export default ArtistLogin;
