import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDateTime } from '../../hooks/useDateTime';
import { BRAND } from '../../utils/constants';
import type { ViewMode } from '../Agenda/Agenda';
import styles from './Navbar.module.scss';

const CLIENT_NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'portafolio', label: 'Trabajos' },
  { id: 'agenda-clientes', label: 'Agenda' },
  { id: 'cuidados', label: 'Cuidados' },
  { id: 'contacto', label: 'Contacto' },
];

const ARTIST_NAV = [
  { id: 'agenda-tatuador', label: 'Agenda' },
  { id: 'reservas-tatuador', label: 'Reservas' },
];

type NavbarProps = {
  viewMode: ViewMode;
  onToggleView: () => void;
};

export const Navbar = ({ viewMode, onToggleView }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { time, date } = useDateTime();
  const isArtistView = viewMode === 'tatuador';
  const navItems = isArtistView ? ARTIST_NAV : CLIENT_NAV;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  };

  const goHome = () => go(isArtistView ? 'agenda-tatuador' : 'inicio');
  const goPrimary = () => go(isArtistView ? 'reservas-tatuador' : 'agenda-clientes');

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.bar}>
        <button type="button" className={styles.logo} onClick={goHome}>
          <span className={styles.logoMark} />
          <span className={styles.logoText}>
            <em className={styles.logoAccent}>{BRAND.logoA}</em>
            {BRAND.logoB}
          </span>
          <span className={styles.logoTag}>TATTOO</span>
        </button>

        <div className={styles.datetime} aria-live="polite">
          <span className={styles.time}>{time}</span>
          <span className={styles.date}>{date}</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => go(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={styles.viewSwitch}
          onClick={onToggleView}
          aria-pressed={isArtistView}
        >
          {isArtistView ? 'Vista cliente' : 'Vista tatuador'}
        </button>

        <button type="button" className={styles.cta} onClick={goPrimary}>
          {isArtistView ? 'Reservas' : 'Disponibilidad'}
        </button>

        <button
          type="button"
          className={`${styles.menuBtn} ${isOpen ? styles.open : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.mobilePanel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className={styles.mobileDatetime}>
              <span>{time}</span>
              <span>{date}</span>
            </div>
            {navItems.map((item) => (
              <button key={item.id} type="button" onClick={() => go(item.id)}>
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className={styles.mobileSwitch}
              onClick={() => {
                onToggleView();
                setIsOpen(false);
              }}
            >
              {isArtistView ? 'Cambiar a cliente' : 'Cambiar a tatuador'}
            </button>
            <button type="button" className={styles.mobileCta} onClick={goPrimary}>
              {isArtistView ? 'Ver reservas' : 'Ver disponibilidad'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
