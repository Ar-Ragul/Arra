import { useRef } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { experience } from '../data/resume';
import { Reveal } from './Reveal';
import styles from './Experience.module.css';

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseMonthYear(text: string): Date {
  const [mon, year] = text.trim().split(' ');
  return new Date(Number(year), MONTHS[mon] ?? 0, 1);
}

function formatDuration(period: string): string {
  const [startRaw, endRaw] = period.split('—').map((s) => s.trim());
  const start = parseMonthYear(startRaw);
  const end = /present/i.test(endRaw) ? new Date() : parseMonthYear(endRaw);
  const months = Math.max(1, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
  const years = Math.floor(months / 12);
  const remMonths = months % 12;
  const parts: string[] = [];
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remMonths) parts.push(`${remMonths} mo${remMonths > 1 ? 's' : ''}`);
  return parts.join(' ');
}

function initials(company: string): string {
  return company
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 0.8', 'end 0.55'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });
  const progressTransform = useMotionTemplate`scaleY(${reduceMotion ? 1 : smoothProgress})`;

  return (
    <section id="experience">
      <div className="container">
        <Reveal className={styles.header}>
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Where I’ve worked</h2>
        </Reveal>

        <div className={styles.timeline} ref={timelineRef}>
          <span className={styles.track} aria-hidden="true" />
          <motion.span className={styles.progress} style={{ transform: progressTransform }} aria-hidden="true" />

          {experience.map((job, i) => {
            const isCurrent = /present/i.test(job.period);
            return (
              <Reveal as="div" key={`${job.company}-${job.period}`} delay={i * 60} className={styles.entry}>
                <div className={styles.badgeCol}>
                  <span className={styles.badge} data-current={isCurrent}>{initials(job.company)}</span>
                </div>

                <div className={styles.content}>
                  <div className={styles.entryHead}>
                    <div className={styles.roleRow}>
                      <h3 className={styles.role}>{job.role}</h3>
                      {isCurrent && (
                        <span className={styles.currentTag}>
                          <span className={styles.pulseDot} aria-hidden="true" />
                          Current
                        </span>
                      )}
                    </div>
                    <p className={styles.companyLine}>
                      <span className={styles.company}>{job.company}</span>
                      {job.client && <span>· Client: {job.client}</span>}
                      <span>· {job.location}</span>
                    </p>
                    <p className={styles.meta}>
                      {job.period} · <span className={styles.duration}>{formatDuration(job.period)}</span>
                    </p>
                  </div>

                  <ul className={styles.bullets}>
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>
                        <span className={styles.bulletMark} aria-hidden="true" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.tech}>
                    {job.tech.map((item) => (
                      <span className="chip" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
