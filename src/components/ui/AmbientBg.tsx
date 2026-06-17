import { motion } from 'framer-motion';
import { EmberParticles } from './EmberParticles';
import styles from './AmbientBg.module.scss';

type Variant = 'hero' | 'section' | 'contact';

interface AmbientBgProps {
  variant?: Variant;
}

const MOTIFS = [
  { type: 'skull' as const, top: '6%', left: '4%', size: 64, duration: 12, delay: 0 },
  { type: 'cross' as const, top: '15%', left: '90%', size: 52, duration: 14, delay: 0.5 },
  { type: 'cross' as const, top: '70%', left: '2%', size: 46, duration: 13, delay: 1 },
  { type: 'skull' as const, top: '62%', left: '85%', size: 58, duration: 16, delay: 0.3 },
  { type: 'skull' as const, top: '38%', left: '94%', size: 40, duration: 18, delay: 2 },
  { type: 'cross' as const, top: '88%', left: '42%', size: 44, duration: 15, delay: 1.2 },
  { type: 'skull' as const, top: '28%', left: '12%', size: 36, duration: 17, delay: 2.5 },
  { type: 'cross' as const, top: '48%', left: '78%', size: 38, duration: 19, delay: 0.8 },
];

const SkullSvg = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
    <path
      d="M32 10c-10 0-18 8-18 18 0 6 3 11 7 14v6h6v-4h10v4h6v-6c4-3 7-8 7-14 0-10-8-18-18-18z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="26" r="3" fill="currentColor" />
    <circle cx="40" cy="26" r="3" fill="currentColor" />
    <path d="M26 36h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M28 44v4M32 44v4M36 44v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CrossSvg = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden>
    <path
      d="M28 8h8v16h16v8H36v24h-8V32H12v-8h16V8z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export const AmbientBg = ({ variant = 'section' }: AmbientBgProps) => (
  <motion.div
    className={`${styles.ambient} ${styles[variant]}`}
    aria-hidden
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <motion.div
      className={styles.pulseGlow}
      animate={{ opacity: [0.4, 0.75, 0.4], scale: [1, 1.15, 1] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
    />
    <EmberParticles />

    {MOTIFS.map((m, i) => (
      <motion.div
        key={i}
        className={styles.motif}
        style={{ top: m.top, left: m.left }}
        animate={{
          y: [0, -28, 12, 0],
          rotate: [0, m.type === 'cross' ? 12 : -10, 6, 0],
          opacity: [0.08, 0.22, 0.14, 0.08],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{
          duration: m.duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: m.delay,
        }}
      >
        {m.type === 'skull' ? <SkullSvg size={m.size} /> : <CrossSvg size={m.size} />}
      </motion.div>
    ))}

    <motion.div
      className={styles.orb1}
      animate={{
        x: [0, 55, -30, 0],
        y: [0, -40, 25, 0],
        scale: [1, 1.15, 0.9, 1],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    />
    <motion.div
      className={styles.orb2}
      animate={{
        x: [0, -60, 35, 0],
        y: [0, 50, -30, 0],
        scale: [1, 1.1, 1, 1],
      }}
      transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
    />
    <div className={styles.grid} />
    <motion.div
      className={styles.scanline}
      animate={{ y: ['-120%', '220%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
    />
  </motion.div>
);
