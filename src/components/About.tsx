import { experience, highlights, profile, projects, skillGroups } from '../data/resume';
import { Reveal } from './Reveal';
import { StatRow } from './StatRow';
import styles from './About.module.css';

const STATS = [
  { label: 'Years experience', value: 4, suffix: '+' },
  { label: 'Companies', value: experience.length },
  { label: 'Projects shipped', value: projects.length },
];

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

            <StatRow stats={STATS} className={styles.stats} />

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

        <Reveal delay={140} className={styles.approachNote}>
          <p>“I reach for the right tool for the job — pragmatic over dogmatic, and always with an eye on what the user actually feels.”</p>
        </Reveal>
      </div>
    </section>
  );
}
