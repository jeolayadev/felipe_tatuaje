import { motion } from 'framer-motion';
import styles from './DashboardMetrics.module.scss';

interface Metric {
  label: string;
  value: string | number;
  subvalue?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'gold' | 'blue' | 'green' | 'red';
}

interface DashboardMetricsProps {
  metrics: Metric[];
  title?: string;
}

export const DashboardMetrics = ({ metrics, title }: DashboardMetricsProps) => {
  const colorMap: Record<string, string> = {
    gold: '#d4af37',
    blue: '#3b82f6',
    green: '#10b981',
    red: '#ef4444',
  };

  const trendIcons: Record<string, string> = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}

      <div className={styles.grid}>
        {metrics.map((metric, index) => (
          <motion.article
            key={`${metric.label}-${index}`}
            className={styles.card}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <div className={styles.icon}>{metric.icon}</div>

            <div className={styles.content}>
              <span className={styles.label}>{metric.label}</span>
              <div className={styles.valueRow}>
                <strong
                  className={styles.value}
                  style={{
                    color: metric.color ? colorMap[metric.color] : '#d4af37',
                  }}
                >
                  {metric.value}
                </strong>
                {metric.trend && (
                  <span
                    className={`${styles.trend} ${styles[metric.trend]}`}
                  >
                    {trendIcons[metric.trend]}
                  </span>
                )}
              </div>
              {metric.subvalue && (
                <small className={styles.subvalue}>{metric.subvalue}</small>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};
