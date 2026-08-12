import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useSpring } from 'motion/react';
import { projects, type Project } from '../data/resume';
import { Reveal } from './Reveal';
import styles from './Projects.module.css';

const PROJECT_COLORS = ['#0071e3', '#8a5cf6', '#34d3c9', '#ff6b6b', '#f5a623', '#30d158'];

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572a5',
  Kotlin: '#a97bff',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
};

function projectInitials(name: string): string {
  const words = name.split(/[-_\s]+/).filter(Boolean);
  const parts = words.length >= 2 ? words : name.match(/[A-Z][a-z]*/g) || [name];
  return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

type RepoStats = { stars: number; language: string | null };
const repoCache = new Map<string, RepoStats | null>();

function useRepoStats(url: string): RepoStats | null {
  const [stats, setStats] = useState<RepoStats | null>(repoCache.get(url) ?? null);

  useEffect(() => {
    if (repoCache.has(url)) {
      setStats(repoCache.get(url) ?? null);
      return;
    }
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) return;
    const [, owner, repo] = match;

    fetch(`https://api.github.com/repos/${owner}/${repo}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const result: RepoStats | null = json ? { stars: json.stargazers_count, language: json.language } : null;
        repoCache.set(url, result);
        setStats(result);
      })
      .catch(() => {
        repoCache.set(url, null);
        setStats(null);
      });
  }, [url]);

  return stats;
}

function ProjectCardInner({ project, color }: { project: Project; color: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);
  const stats = useRepoStats(project.url);

  const rotateX = useSpring(0, { stiffness: 260, damping: 22, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 22, mass: 0.5 });
  const scale = useSpring(1, { stiffness: 260, damping: 22, mass: 0.5 });
  const cardTransform = useMotionTemplate`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

  useEffect(() => {
    setCanTilt(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion);
  }, [reduceMotion]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 10);
    rotateX.set(py * -10);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <a href={project.url} target="_blank" rel="noreferrer" className={`${styles.cardLink} press`}>
      <motion.div
        ref={cardRef}
        className={styles.card}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerEnter={() => canTilt && scale.set(1.015)}
        style={{ transform: cardTransform }}
      >
        <div className={styles.cardHead}>
          <div className={styles.titleGroup}>
            <span
              className={styles.badge}
              style={{
                color,
                background: `color-mix(in srgb, ${color} 14%, var(--card-bg))`,
                borderColor: `color-mix(in srgb, ${color} 30%, var(--card-border))`,
              }}
            >
              {projectInitials(project.name)}
            </span>
            <h3 className={styles.name}>{project.name}</h3>
          </div>
          <span className={styles.linkIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        </div>

        <p className={styles.tagline}>{project.tagline}</p>

        {stats && (stats.stars > 0 || stats.language) && (
          <div className={styles.repoMeta}>
            {stats.stars > 0 && (
              <span className={styles.metaItem}>
                <svg viewBox="0 0 24 24" fill="currentColor" className={styles.starIcon}>
                  <path d="M12 2.5l2.9 6.35 6.98.61-5.28 4.64 1.6 6.84L12 17.6l-6.2 3.34 1.6-6.84L2.12 9.46l6.98-.61L12 2.5z" />
                </svg>
                {stats.stars}
              </span>
            )}
            {stats.language && (
              <span className={styles.metaItem}>
                <span className={styles.langDot} style={{ background: LANG_COLORS[stats.language] ?? 'var(--text-tertiary)' }} />
                {stats.language}
              </span>
            )}
          </div>
        )}

        <ul className={styles.description}>
          {project.description.map((line) => (
            <li key={line}>
              <span className={styles.mark} aria-hidden="true" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        <div className={styles.tech}>
          {project.tech.map((item) => (
            <span className="chip" key={item}>
              {item}
            </span>
          ))}
        </div>
      </motion.div>
    </a>
  );
}

function StaticGrid() {
  return (
    <div className={styles.grid}>
      {projects.map((project, i) => (
        <Reveal delay={(i % 3) * 60} key={project.name}>
          <ProjectCardInner project={project} color={PROJECT_COLORS[i % PROJECT_COLORS.length]} />
        </Reveal>
      ))}
    </div>
  );
}

function MarqueeColumn({ items, duration }: { items: { project: Project; color: string }[]; duration: number }) {
  return (
    <div className={styles.column}>
      <div className={styles.columnTrack} style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((copy) =>
          items.map(({ project, color }) => (
            <div className={styles.marqueeItem} key={`${project.name}-${copy}`}>
              <ProjectCardInner project={project} color={color} />
            </div>
          )),
        )}
      </div>
    </div>
  );
}

function MarqueeGrid() {
  const columns: { project: Project; color: string }[][] = [[], [], []];
  projects.forEach((project, i) => {
    columns[i % 3].push({ project, color: PROJECT_COLORS[i % PROJECT_COLORS.length] });
  });
  const durations = [34, 40, 37];

  return (
    <Reveal className={styles.marqueeWrap}>
      {columns.map((items, i) => (
        <MarqueeColumn items={items} duration={durations[i]} key={i} />
      ))}
    </Reveal>
  );
}

export function Projects() {
  const [useMarquee, setUseMarquee] = useState(false);

  useEffect(() => {
    const widthQuery = window.matchMedia('(min-width: 860px) and (hover: hover) and (pointer: fine)');
    const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setUseMarquee(widthQuery.matches && !reduceQuery.matches);
    update();
    widthQuery.addEventListener('change', update);
    reduceQuery.addEventListener('change', update);
    return () => {
      widthQuery.removeEventListener('change', update);
      reduceQuery.removeEventListener('change', update);
    };
  }, []);

  return (
    <section id="projects">
      <div className="container">
        <Reveal className={styles.header}>
          <p className="eyebrow">Projects</p>
          <h2 className="section-title">Things I’ve built</h2>
        </Reveal>

        {useMarquee ? <MarqueeGrid /> : <StaticGrid />}
      </div>
    </section>
  );
}
