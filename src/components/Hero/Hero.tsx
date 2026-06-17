import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND } from '../../utils/constants';
import { HERO_IMAGES, type TattooStyle } from '../../data/images';
import { AmbientBg } from '../ui/AmbientBg';
import { SafeImage } from '../ui/SafeImage';
import { SplitText, RevealLine, GlowText } from '../ui/AnimatedText';
import { EASE } from '../../utils/motion';
import styles from './Hero.module.scss';

const ESTILOS = HERO_IMAGES.map((img) => img.estilo);

export const Hero = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(
      () => setActive((i) => (i + 1) % HERO_IMAGES.length),
      4500
    );
    return () => clearInterval(timer);
  }, []);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const selectStyle = (estilo: TattooStyle) => {
    const index = HERO_IMAGES.findIndex((img) => img.estilo === estilo);
    if (index >= 0) setActive(index);
  };

  const current = HERO_IMAGES[active];

  return (
    <section id="inicio" className={styles.hero}>
      <AmbientBg variant="hero" />

      <div className={styles.inner}>
        <motion.div
          className={styles.copy}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <RevealLine className={styles.eyebrow} delay={0.1}>
            Estudio · Santiago
          </RevealLine>

          <h1 className={styles.title}>
            <SplitText text={BRAND.short} delay={0.2} className={styles.titleMain} />
            <SplitText text=" INK" delay={0.55} className={styles.titleAccent} />
          </h1>

          <GlowText className={styles.tagline} delay={0.75}>
            {BRAND.tagline}
          </GlowText>
          <motion.p
            className={styles.taglineSub}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.55, ease: EASE }}
          >
            {BRAND.taglineSub}
          </motion.p>

          <motion.ul
            className={styles.estilos}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.5 } },
            }}
          >
            {ESTILOS.map((estilo) => (
              <motion.li
                key={estilo}
                className={current.estilo === estilo ? styles.estiloActivo : ''}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: { opacity: 1, scale: 1 },
                }}
                onClick={() => selectStyle(estilo)}
                onKeyDown={(e) => e.key === 'Enter' && selectStyle(estilo)}
                role="button"
                tabIndex={0}
              >
                {estilo}
              </motion.li>
            ))}
          </motion.ul>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <button type="button" className={styles.primary} onClick={() => go('agenda-clientes')}>
              Reservar cita
            </button>
            <button
              type="button"
              className={styles.availability}
              onClick={() => go('agenda-clientes')}
            >
              Ver disponibilidad
            </button>
            <button type="button" className={styles.secondary} onClick={() => go('portafolio')}>
              Ver trabajos
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
        >
          <div className={styles.carousel}>
            <span className={styles.slideLabel}>{current.estilo}</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                className={styles.slide}
                initial={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <SafeImage
                  src={current.src}
                  alt={current.alt}
                  loading="eager"
                  className={styles.slideImg}
                />
                <motion.div
                  className={styles.slideShine}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
                />
              </motion.div>
            </AnimatePresence>
            <div className={styles.slideBorder} />
          </div>

          <div className={styles.thumbs}>
            {HERO_IMAGES.map((img, i) => (
              <motion.button
                key={img.estilo}
                type="button"
                className={`${styles.thumb} ${i === active ? styles.thumbActive : ''}`}
                onClick={() => setActive(i)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`${img.estilo}: ${img.alt}`}
              >
                <SafeImage src={img.src} alt={img.alt} loading="eager" />
                <span className={styles.thumbTag}>{img.estilo}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
