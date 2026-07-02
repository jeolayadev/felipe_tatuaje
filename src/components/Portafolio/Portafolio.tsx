import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PORTFOLIO_IMAGES } from '../../data/images';
import { AmbientBg } from '../ui/AmbientBg';
import { SafeImage } from '../ui/SafeImage';
import { SectionReveal } from '../ui/SectionReveal';
import { SectionTitle } from '../ui/AnimatedText';
import { LuxuryCarousel } from '../LuxuryCarousel/LuxuryCarousel';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { staggerContainer, staggerItem } from '../../utils/motion';
import styles from './Portafolio.module.scss';

const filtros = ['Todos', 'Realismo', 'Blackwork', 'Fine Line', 'Tradicional'];

export const Portafolio = () => {
  const [filtro, setFiltro] = useState('Todos');
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' });
  const isMobile = useIsMobile();

  const lista =
    filtro === 'Todos'
      ? PORTFOLIO_IMAGES
      : PORTFOLIO_IMAGES.filter((t) => t.categoria === filtro);

  const [selected, setSelected] = useState<(typeof PORTFOLIO_IMAGES)[number] | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleCardClick = (item: typeof PORTFOLIO_IMAGES[number]) => {
    setSelected(item);
  };

  const stepImage = (current: (typeof PORTFOLIO_IMAGES)[number] | null, dir: 1 | -1) => {
    if (!current) return current;
    const index = PORTFOLIO_IMAGES.findIndex((img) => img.id === current.id);
    const next = (index + dir + PORTFOLIO_IMAGES.length) % PORTFOLIO_IMAGES.length;
    return PORTFOLIO_IMAGES[next];
  };

  const handleNextImage = () => setSelected((current) => stepImage(current, 1));
  const handlePrevImage = () => setSelected((current) => stepImage(current, -1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setSelected((current) => stepImage(current, 1));
      if (e.key === 'ArrowLeft') setSelected((current) => stepImage(current, -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Auto-desplazamiento del carrusel de tarjetas en telefono. Se pausa al
  // tocar y mientras el lightbox este abierto, y reinicia al llegar al final.
  useEffect(() => {
    if (!isMobile || selected) return;
    const el = gridRef.current;
    if (!el) return;

    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout>;
    const pause = () => {
      paused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { paused = false; }, 4500);
    };
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('pointerdown', pause);

    const id = setInterval(() => {
      if (paused) return;
      const first = el.firstElementChild as HTMLElement | null;
      const step = first ? first.clientWidth + 12 : el.clientWidth;
      const maxScroll = el.scrollWidth - el.clientWidth - 8;
      if (el.scrollLeft >= maxScroll) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);

    return () => {
      clearInterval(id);
      clearTimeout(resumeTimer);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('pointerdown', pause);
    };
  }, [isMobile, selected, filtro]);

  return (
    <section id="portafolio" className={styles.section}>
      <AmbientBg variant="section" />

      <div className={styles.wrap}>
        <SectionTitle subtitle="Realismo · Blackwork · Fine Line · Tradicional">
          Trabajos destacados
        </SectionTitle>

        {/* Carrusel 3D decorativo: solo en tablet/escritorio. En teléfono se usa
            el carrusel deslizable de tarjetas para evitar scroll excesivo. */}
        <div className={styles.luxuryWrap}>
          <LuxuryCarousel />
        </div>

        <SectionReveal delay={0.1}>
          <div className={styles.filtros}>
            {filtros.map((f) => (
              <button
                key={f}
                type="button"
                className={filtro === f ? styles.activo : ''}
                onClick={() => setFiltro(f)}
              >
                {f}
                {filtro === f && (
                  <motion.span
                    className={styles.filtroGlow}
                    layoutId="filtroActivo"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </SectionReveal>

        <p className={styles.swipeHint} aria-hidden>
          Desliza para ver más <span>→</span>
        </p>

        <motion.div
          ref={gridRef}
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
        >
          <AnimatePresence mode="popLayout">
            {lista.map((t) => (
              <motion.article
                key={t.id}
                layout
                variants={staggerItem}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.25 } }}
                className={styles.card}
                onMouseEnter={() => setHoveredId(t.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTap={() => handleCardClick(t)}
              >
                <div
                  className={styles.imgWrap}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver ${t.titulo}`}
                  onClick={() => handleCardClick(t)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleCardClick(t); }}
                >
                  <SafeImage src={t.src} alt={t.alt} />
                  <motion.div
                    className={styles.imgOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === t.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className={styles.meta}>
                  <strong>{t.titulo}</strong>
                  <span>{t.categoria}</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox / modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className={styles.lightbox}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            >
              <motion.div
                className={styles.lightboxContent}
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <SafeImage src={selected.src} alt={selected.alt} loading="eager" />
                
                {/* Navigation buttons */}
                <motion.button
                  className={styles.navBtn}
                  style={{ left: '1rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Imagen anterior"
                >
                  ←
                </motion.button>

                <motion.button
                  className={styles.navBtn}
                  style={{ right: '1rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Siguiente imagen"
                >
                  →
                </motion.button>

                <button
                  className={styles.closeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(null);
                  }}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portafolio;
