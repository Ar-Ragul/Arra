import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion, useMotionTemplate, useReducedMotion, useSpring } from 'motion/react';
import { projects, type Project } from '../data/resume';
import { Reveal } from './Reveal';
import styles from './Projects.module.css';

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [canTilt, setCanTilt] = useState(false);

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
    <Reveal delay={delay}>
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
            <h3 className={styles.name}>{project.name}</h3>
            <span className={styles.linkIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </span>
          </div>

          <p className={styles.tagline}>{project.tagline}</p>

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
    </Reveal>
  );
}

export function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <Reveal className={styles.header}>
          <p className="eyebrow">Projects</p>
          <h2 className="section-title">Things I’ve built</h2>
        </Reveal>

        <div className={styles.grid}>
          {projects.map((project, i) => (
            <ProjectCard project={project} delay={(i % 3) * 60} key={project.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
