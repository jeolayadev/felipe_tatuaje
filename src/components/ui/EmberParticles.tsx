import { motion } from 'framer-motion';
import styles from './EmberParticles.module.scss';

const EMBERS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${4 + (i * 3.1) % 92}%`,
  size: 2 + (i % 4),
  duration: 5 + (i % 6) * 1.5,
  delay: (i % 9) * 0.5,
}));

export const EmberParticles = () => (
  <div className={styles.embers} aria-hidden>
    {EMBERS.map((e) => (
      <motion.span
        key={e.id}
        className={styles.ember}
        style={{
          left: e.left,
          width: e.size,
          height: e.size,
        }}
        animate={{
          y: [0, -160 - (e.id % 5) * 50],
          x: [0, (e.id % 2 === 0 ? 1 : -1) * (8 + (e.id % 6))],
          opacity: [0, 1, 0.7, 0],
          scale: [0.4, 1.2, 0.9, 0.2],
        }}
        transition={{
          duration: e.duration,
          repeat: Infinity,
          ease: 'easeOut',
          delay: e.delay,
        }}
      />
    ))}
  </div>
);
