import { motion } from 'framer-motion';
import styles from './StatChart.module.scss';

interface DataPoint {
  label: string;
  value: number;
  maxValue?: number;
}

interface StatChartProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'donut';
  color?: string;
}

export const StatChart = ({
  title,
  data,
  type = 'bar',
  color = '#d4af37',
}: StatChartProps) => {
  const maxValue = Math.max(
    ...(data.map((d) => d.maxValue || d.value) || [100])
  );

  return (
    <div className={`${styles.container} ${styles[type]}`}>
      <h4 className={styles.title}>{title}</h4>

      {type === 'bar' && (
        <div className={styles.barChart}>
          {data.map((point, index) => {
            const percentage = (point.value / maxValue) * 100;

            return (
              <motion.div
                key={point.label}
                className={styles.barItem}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <span className={styles.label}>{point.label}</span>
                <div className={styles.barTrack}>
                  <motion.div
                    className={styles.barFill}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      delay: index * 0.05 + 0.2,
                      duration: 0.6,
                      ease: 'easeOut',
                    }}
                    style={{ backgroundColor: color }}
                  />
                </div>
                <span className={styles.value}>{point.value}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {type === 'line' && (
        <div className={styles.lineChart}>
          <div className={styles.chartContainer}>
            {data.map((point, index) => (
              <motion.div
                key={point.label}
                className={styles.dataPoint}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.pointLabel}>{point.label}</div>
                <motion.div
                  className={styles.pointValue}
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(point.value / maxValue) * 100}%`,
                  }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {type === 'donut' && (
        <div className={styles.donutChart}>
          <div className={styles.donutContainer}>
            <div className={styles.donutVisual}>
              {data.map((point, index) => {
                const total = data.reduce((sum, d) => sum + d.value, 0);
                const percentage = (point.value / total) * 100;
                
                return (
                  <motion.div
                    key={point.label}
                    className={styles.donutSegment}
                    style={{
                      background: color,
                      width: '100%',
                      height: '100%',
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 0.7 + index * 0.1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    title={`${point.label}: ${percentage.toFixed(0)}%`}
                  />
                );
              })}
            </div>
          </div>
          <div className={styles.legend}>
            {data.map((point) => (
              <div key={point.label} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ backgroundColor: color }}
                />
                <span className={styles.legendLabel}>{point.label}</span>
                <span className={styles.legendValue}>{point.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
