import { useState } from 'react';
import styles from './SafeImage.module.scss';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  srcSet?: string;
  sizes?: string;
}

export const SafeImage = ({ 
  src, 
  alt, 
  className = '', 
  loading = 'eager',
  srcSet,
  sizes,
}: SafeImageProps) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${styles.fallback} ${className}`} role="img" aria-label={alt}>
        <span>INK</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      srcSet={srcSet}
      sizes={sizes}
      onError={() => setError(true)}
    />
  );
};
