import { motion } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { STUDIO_IMAGE } from '../../data/images';
import { AmbientBg } from '../ui/AmbientBg';
import { SafeImage } from '../ui/SafeImage';
import { SectionReveal } from '../ui/SectionReveal';
import { SectionTitle } from '../ui/AnimatedText';
import styles from './Contacto.module.scss';

export const Contacto = () => {
  const goToAgenda = () =>
    document.getElementById('agenda-clientes')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="contacto" className={styles.section}>
      <AmbientBg variant="contact" />

      <div className={styles.wrap}>
        <SectionTitle subtitle="Visítanos o reserva tu hora en línea">
          Contacto
        </SectionTitle>

        <div className={styles.grid}>
          <SectionReveal delay={0.1} className={styles.infoCol}>
            <aside className={styles.info}>
              <div>
                <h3>Horario</h3>
                <p>Mar–Vie 14:00–21:00 · Sáb 12:00–20:00</p>
              </div>
              <div>
                <h3>Ubicación</h3>
                <p>{BRAND.location}</p>
              </div>
              <div>
                <h3>Contacto</h3>
                <p>
                  <a href={`tel:${BRAND.phone.replace(/\s/g, '')}`}>{BRAND.phone}</a>
                  <br />
                  <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                </p>
              </div>
              <button type="button" className={styles.cta} onClick={goToAgenda}>
                Reservar cita
              </button>
            </aside>
          </SectionReveal>

          <SectionReveal delay={0.2} className={styles.mapCol}>
            <motion.div
              className={styles.map}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35 }}
            >
              <SafeImage src={STUDIO_IMAGE.src} alt={STUDIO_IMAGE.alt} loading="lazy" />
              <span className={styles.mapLabel}>NUESTRO ESTUDIO</span>
            </motion.div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
