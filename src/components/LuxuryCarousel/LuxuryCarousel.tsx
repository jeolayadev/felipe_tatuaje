import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { PORTFOLIO_IMAGES } from '../../data/images';
import styles from './LuxuryCarousel.module.scss';

interface CardState {
  position: 'left' | 'center' | 'right';
  opacity: number;
  scale: number;
  x: number;
  rotateY: number;
  zIndex: number;
}

export const LuxuryCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [autoPlay, setAutoPlay] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const carouselRef = useRef(null);
  const inView = useInView(carouselRef, { once: true, margin: '-40px' });

  const images = useMemo(() => PORTFOLIO_IMAGES.slice(0, 6), []);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setTimeout(() => {
      handleNext();
    }, 5000);
    return () => clearTimeout(timer);
  }, [currentIndex, autoPlay]);

  const getCardState = (index: number): CardState => {
    const relative = (index - currentIndex + images.length) % images.length;

    if (relative === 0) {
      return {
        position: 'center',
        opacity: 1,
        scale: 1,
        x: 0,
        rotateY: 0,
        zIndex: 30,
      };
    }

    if (relative === 1 || relative === images.length - 1) {
      const isRight = relative === 1;
      return {
        position: isRight ? 'right' : 'left',
        opacity: 0.6,
        scale: 0.75,
        x: isRight ? 280 : -280,
        rotateY: isRight ? -25 : 25,
        zIndex: 20,
      };
    }

    return {
      position: 'right',
      opacity: 0,
      scale: 0.5,
      x: 400,
      rotateY: -35,
      zIndex: 10,
    };
  };

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setAutoPlay(true);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoPlay(true);
  };

  const handleDotClick = (index: number) => {
    if (index > currentIndex) setDirection('next');
    if (index < currentIndex) setDirection('prev');
    setCurrentIndex(index);
    setAutoPlay(true);
  };

  return (
    <section ref={carouselRef} className={styles.carousel}>
      <div className={styles.container}>
        <motion.div
          className={styles.track}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className={styles.sideCards}>
            <AnimatePresence mode="sync" custom={direction}>
              {images.map((image, index) => {
                const cardState = getCardState(index);
                const isHovered = hoveredId === image.id;

                return (
                  <motion.div
                    key={`carousel-${image.id}-${currentIndex}`}
                    className={`${styles.card} ${styles[cardState.position]}`}
                    custom={direction}
                    initial={{
                      opacity: 0,
                      rotateY: direction === 'next' ? -45 : 45,
                      x: direction === 'next' ? 200 : -200,
                    }}
                    animate={{
                      opacity: cardState.opacity,
                      scale: cardState.scale,
                      x: cardState.x,
                      rotateY: cardState.rotateY,
                      zIndex: cardState.zIndex,
                    }}
                    exit={{
                      opacity: 0,
                      rotateY: direction === 'next' ? 45 : -45,
                      x: direction === 'next' ? -200 : 200,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: 'easeInOut',
                    }}
                    onMouseEnter={() => {
                      setHoveredId(image.id);
                      setAutoPlay(false);
                    }}
                    onMouseLeave={() => {
                      setHoveredId(null);
                      setAutoPlay(true);
                    }}
                    style={{
                      perspective: '1200px',
                    }}
                  >
                    <motion.div
                      className={styles.cardInner}
                      whileHover={cardState.position === 'center' ? { scale: 1.02 } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.imageWrapper}>
                        <img
                          src={image.src}
                          alt={image.alt}
                          loading="lazy"
                          className={styles.image}
                        />
                        <div className={`${styles.overlay} ${isHovered ? styles.overlayActive : ''}`}>
                          <motion.div
                            className={styles.overlayContent}
                            initial={{ opacity: 0, y: 10 }}
                            animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.3 }}
                          >
                            <h3>{image.titulo}</h3>
                            <p>{image.categoria}</p>
                          </motion.div>
                        </div>
                      </div>

                      {cardState.position === 'center' && (
                        <motion.div
                          className={styles.cardInfo}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.4 }}
                        >
                          <h4>{image.titulo}</h4>
                          <p className={styles.category}>{image.categoria}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className={styles.controls}>
          <motion.button
            className={styles.navButton}
            onClick={handlePrev}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </motion.button>

          <div className={styles.dots}>
            {images.map((_, index) => (
              <motion.button
                key={`dot-${index}`}
                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                onClick={() => handleDotClick(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Ir a foto ${index + 1}`}
              />
            ))}
          </div>

          <motion.button
            className={styles.navButton}
            onClick={handleNext}
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Siguiente"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.button>
        </div>

        <motion.div
          className={styles.indicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{images.length}</span>
        </motion.div>
      </div>
    </section>
  );
};
