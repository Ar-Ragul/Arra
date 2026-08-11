import { certifications, education, journals, patent } from '../data/resume';
import { Reveal } from './Reveal';
import styles from './Education.module.css';

export function Education() {
  return (
    <section id="education">
      <div className="container">
        <Reveal className={styles.header}>
          <p className="eyebrow">Education</p>
          <h2 className="section-title">Education &amp; recognition</h2>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.card}>
            <p className={styles.cardTitle}>Education</p>
            {education.map((entry) => (
              <div className={styles.eduItem} key={entry.degree}>
                <p className={styles.degree}>{entry.degree}</p>
                <p className={styles.school}>
                  {entry.school} · {entry.location}
                </p>
                <p className={styles.period}>{entry.period}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={60} className={styles.card}>
            <p className={styles.cardTitle}>Certifications</p>
            <ul className={styles.list}>
              {certifications.map((item) => (
                <li key={item}>
                  <span className={styles.mark} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120} className={styles.card}>
            <p className={styles.cardTitle}>Journal</p>
            <ul className={styles.list}>
              {journals.map((item) => (
                <li key={item}>
                  <span className={styles.mark} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180} className={styles.card}>
            <p className={styles.cardTitle}>Patent</p>
            <p className={styles.patentTitle}>{patent.title}</p>
            <p className={styles.patentBody}>{patent.description}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
