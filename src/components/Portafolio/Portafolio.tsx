import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PORTFOLIO_IMAGES } from '../../data/images';
import { AmbientBg } from '../ui/AmbientBg';
import { SafeImage } from '../ui/SafeImage';
import { SectionReveal } from '../ui/SectionReveal';
import { SectionTitle } from '../ui/AnimatedText';
import { LuxuryCarousel } from '../LuxuryCarousel/LuxuryCarousel';
import { staggerContainer, staggerItem } from '../../utils/motion';
import styles from './Portafolio.module.scss';

const filtros = ['Todos', 'Dragón', 'Koi', 'Manga', 'Espalda', 'Irezumi'];

export const Portafolio = () => {
  const [filtro, setFiltro] = useState('Todos');
  const gridRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: '-40px' });

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

  const handleNextImage = () => {
    if (!selected) return;
    const currentIndex = PORTFOLIO_IMAGES.findIndex((img) => img.id === selected.id);
    const nextIndex = (currentIndex + 1) % PORTFOLIO_IMAGES.length;
    setSelected(PORTFOLIO_IMAGES[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!selected) return;
    const currentIndex = PORTFOLIO_IMAGES.findIndex((img) => img.id === selected.id);
    const prevIndex = currentIndex === 0 ? PORTFOLIO_IMAGES.length - 1 : currentIndex - 1;
    setSelected(PORTFOLIO_IMAGES[prevIndex]);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selected) return;
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <section id="portafolio" className={styles.section}>
      <AmbientBg variant="section" />

      <div className={styles.wrap}>
        <SectionTitle subtitle="Colección irezumi · Full HD">Trabajos japoneses</SectionTitle>

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
