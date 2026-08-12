import type { ReactNode } from 'react';
import { certifications, education, journals, patent } from '../data/resume';
import { Reveal } from './Reveal';
import { StatRow } from './StatRow';
import styles from './Education.module.css';

const EDU_STATS = [
  { label: 'Degrees', value: education.length },
  { label: 'Certifications', value: certifications.length },
  { label: 'Recognitions', value: journals.length + 1 },
];

function schoolInitials(school: string): string {
  const leadingAcronym = school.match(/^((?:[A-Z]\.){2,})/);
  if (leadingAcronym) return leadingAcronym[1].replace(/\./g, '');
  const stopwords = new Set(['of', 'and', '&', 'the', 'in']);
  const words = school.split(/[\s,]+/).filter((w) => w && !stopwords.has(w.toLowerCase()));
  return words.slice(0, 3).map((w) => w[0]).join('').toUpperCase();
}

function AchievementIcon({ icon, color }: { icon: ReactNode; color: string }) {
  return (
    <span
      className={styles.achievementIcon}
      style={{
        color,
        background: `color-mix(in srgb, ${color} 14%, var(--card-bg))`,
        borderColor: `color-mix(in srgb, ${color} 30%, var(--card-border))`,
      }}
    >
      {icon}
    </span>
  );
}

export function Education() {
  return (
    <section id="education">
      <div className="container">
        <Reveal className={styles.header}>
          <p className="eyebrow">Education</p>
          <h2 className="section-title">Education &amp; recognition</h2>
        </Reveal>

        <StatRow stats={EDU_STATS} className={styles.stats} />

        <Reveal className={styles.eduCard}>
          <p className={styles.cardTitle}>Education</p>
          <div className={styles.degrees}>
            {education.map((entry) => (
              <div className={styles.degreeCol} key={entry.degree}>
                <span className={styles.eduBadge}>{schoolInitials(entry.school)}</span>
                <div>
                  <p className={styles.degree}>{entry.degree}</p>
                  <p className={styles.school}>
                    {entry.school} · {entry.location}
                  </p>
                  <p className={styles.period}>{entry.period}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className={styles.achievements}>
          <Reveal className={styles.achievementCard}>
            <AchievementIcon
              color="var(--accent)"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M8.5 12.5 7 21l5-2.5 5 2.5-1.5-8.5" />
                </svg>
              }
            />
            <p className={styles.achievementTitle}>Certifications</p>
            <ul className={styles.list}>
              {certifications.map((item) => (
                <li key={item}>
                  <span className={styles.mark} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={60} className={styles.achievementCard}>
            <AchievementIcon
              color="#8a5cf6"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                </svg>
              }
            />
            <p className={styles.achievementTitle}>Journal</p>
            <ul className={styles.list}>
              {journals.map((item) => (
                <li key={item}>
                  <span className={styles.mark} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className={styles.achievementCard}>
            <AchievementIcon
              color="#f5a623"
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.05V17h6v-2.25c0-.85.4-1.55 1-2.05A7 7 0 0 0 12 2Z" />
                </svg>
              }
            />
            <span className={styles.statusTag}>Granted</span>
            <p className={styles.achievementTitle}>Patent</p>
            <p className={styles.patentTitle}>{patent.title}</p>
            <p className={styles.patentBody}>{patent.description}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
