import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './StatRow.module.css';

export type StatItem = { label: string; value: number; suffix?: string };

function Stat({ label, value, suffix = '', start }: StatItem & { start: boolean }) {
  const count = useCountUp(value, start);
  return (
    <div className={styles.stat}>
      <p className={styles.value}>
        {count}
        {suffix}
      </p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}

export function StatRow({ stats, className }: { stats: StatItem[]; className?: string }) {
  const { ref, visible } = useScrollReveal();

  return (
    <div ref={ref as never} className={[styles.row, className].filter(Boolean).join(' ')}>
      {stats.map((stat) => (
        <Stat key={stat.label} {...stat} start={visible} />
      ))}
    </div>
  );
}
