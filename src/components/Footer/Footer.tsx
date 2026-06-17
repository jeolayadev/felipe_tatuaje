import { BRAND } from '../../utils/constants';
import styles from './Footer.module.scss';

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <span className={styles.brand}>{BRAND.name}</span>
        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#portafolio">Trabajos</a>
          <a href="#contacto">Contacto</a>
        </nav>
        <p className={styles.copy}>&copy; {year} {BRAND.name}</p>
      </div>
    </footer>
  );
};

export default Footer;
