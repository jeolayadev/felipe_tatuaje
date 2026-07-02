import { motion } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { STUDIO_IMAGE } from '../../data/images';
import { STUDIO_STORY, MILESTONES } from '../../data/studio';
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
        <SectionTitle subtitle={STUDIO_STORY}>El estudio</SectionTitle>

        <ul className={styles.milestones}>
          {MILESTONES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <div className={styles.grid}>
          <SectionReveal delay={0.1} className={styles.infoCol}>
            <aside className={styles.info}>
              <div>
                <h3>Atención</h3>
                <p>
                  {BRAND.hours}
                  <br />
                  <small>Solo se atiende con reserva anticipada.</small>
                </p>
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
                  <br />
                  <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer">
                    {BRAND.instagram}
                  </a>
                </p>
              </div>
              <div>
                <h3>Artista</h3>
                <p>{BRAND.artist}</p>
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
