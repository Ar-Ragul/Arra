import { experience, highlights, profile, projects, skillGroups } from '../data/resume';
import { Reveal } from './Reveal';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';
import styles from './About.module.css';

const STATS = [
  { label: 'Years experience', value: 4, suffix: '+' },
  { label: 'Companies', value: experience.length, suffix: '' },
  { label: 'Projects shipped', value: projects.length, suffix: '' },
];

function StatRow() {
  const { ref, visible } = useScrollReveal();

  return (
    <div ref={ref as never} className={styles.stats}>
      {STATS.map((stat) => (
        <Stat key={stat.label} {...stat} start={visible} />
      ))}
    </div>
  );
}

function Stat({ label, value, suffix, start }: { label: string; value: number; suffix: string; start: boolean }) {
  const count = useCountUp(value, start);
  return (
    <div className={styles.stat}>
      <p className={styles.statValue}>
        {count}
        {suffix}
      </p>
      <p className={styles.statLabel}>{label}</p>
    </div>
  );
}

function SkillsPanel() {
  return (
    <Reveal delay={80} className={styles.skillsPanel}>
      <div className={styles.groups}>
        {skillGroups.map((group) => (
          <div key={group.label} className={styles.group}>
            <p className={styles.groupLabel}>{group.label}</p>
            <div className={styles.chips}>
              {group.items.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className={styles.approachNote}>
        “I reach for the right tool for the job — pragmatic over dogmatic, and always with an eye on what the user actually feels.”
      </p>
    </Reveal>
  );
}

export function About() {
  return (
    <section id="about">
      <div className="container">
        <Reveal className={styles.header}>
          <p className="eyebrow">About</p>
          <h2 className="section-title">What I bring to a team</h2>
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.profileCard}>
            <div className={styles.profileHead}>
              <img src="/avatar.jpg" alt={profile.name} width={64} height={64} className={styles.profileAvatar} />
              <div>
                <p className={styles.profileName}>{profile.name}</p>
                <p className={styles.profileTitle}>{profile.title} · {profile.location}</p>
              </div>
            </div>

            <p className={styles.tagline}>“{profile.tagline}”</p>

            <StatRow />

            <div className={styles.divider} />

            <ul className={styles.highlights}>
              {highlights.map((point) => (
                <li key={point} className={styles.highlightItem}>
                  <svg className={styles.check} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="4 12 9 17 20 6" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <SkillsPanel />
        </div>
      </div>
    </section>
  );
}
