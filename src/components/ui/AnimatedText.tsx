import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { EASE } from '../../utils/motion';
import styles from './AnimatedText.module.scss';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'span';
}

export const SplitText = ({
  text,
  className = '',
  delay = 0,
  as: Tag = 'span',
}: SplitTextProps) => (
  <Tag className={`${styles.split} ${className}`} aria-label={text}>
    {text.split('').map((char, i) => (
      <motion.span
        key={`${char}-${i}`}
        className={styles.char}
        initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          delay: delay + i * 0.035,
          duration: 0.45,
          ease: EASE,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </Tag>
);

interface RevealLineProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const RevealLine = ({ children, className = '', delay = 0 }: RevealLineProps) => (
  <motion.span
    className={`${styles.revealLine} ${className}`}
    initial={{ opacity: 0, x: -24 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.6, ease: EASE }}
  >
    <motion.span
      className={styles.revealAccent}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ delay: delay + 0.15, duration: 0.5, ease: EASE }}
    />
    {children}
  </motion.span>
);

interface SectionTitleProps {
  children: ReactNode;
  subtitle?: string;
  className?: string;
}

export const SectionTitle = ({ children, subtitle, className = '' }: SectionTitleProps) => (
  <div className={`${styles.sectionTitle} ${className}`}>
    <motion.h2
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      <span className={styles.titleShimmer}>{children}</span>
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15, duration: 0.5 }}
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div
      className={styles.titleUnderline}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.25, duration: 0.7, ease: EASE }}
    />
  </div>
);

interface GlowTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const GlowText = ({ children, className = '', delay = 0 }: GlowTextProps) => (
  <motion.p
    className={`${styles.glowText} ${className}`}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.65, ease: EASE }}
  >
    {children}
  </motion.p>
);
