import { useRef } from 'react';
import { AFTERCARE_STEPS } from '../../data/studio';
import { AmbientBg } from '../ui/AmbientBg';
import { SectionReveal } from '../ui/SectionReveal';
import { SectionTitle } from '../ui/AnimatedText';
import styles from './Cuidados.module.scss';

/**
 * Protocolo de cuidados resumido en tarjetas deslizables (scroll-snap).
 * Carrusel horizontal en todas las pantallas: el contenido completo esta
 * disponible sin alargar la pagina hacia abajo.
 */
export const Cuidados = () => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.clientWidth + 14 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section id="cuidados" className={styles.section}>
      <AmbientBg variant="section" />

      <div className={styles.wrap}>
        <div className={styles.headRow}>
          <SectionTitle subtitle="Protocolo con Aquaphor · resumen de los primeros días">
            Cuidados de tu tatuaje
          </SectionTitle>

          <div className={styles.arrows}>
            <button type="button" onClick={() => scrollByCard(-1)} aria-label="Paso anterior">
              ←
            </button>
            <button type="button" onClick={() => scrollByCard(1)} aria-label="Paso siguiente">
              →
            </button>
          </div>
        </div>

        <SectionReveal delay={0.1}>
          <div className={styles.track} ref={trackRef}>
            {AFTERCARE_STEPS.map((step, index) => (
              <article key={step.title} className={styles.card}>
                <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </article>
            ))}
          </div>
        </SectionReveal>

        <p className={styles.note}>
          Una buena cicatrización conserva los detalles por años. Ante cualquier duda, escríbenos.
        </p>
      </div>
    </section>
  );
};

export default Cuidados;
