import { useEffect, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { profile } from '../data/resume';
import { EASE_OUT } from '../lib/easing';
import { HeroDevice } from './HeroDevice';
import styles from './Hero.module.css';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [canFollow, setCanFollow] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const springX = useSpring(glowX, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(glowY, { stiffness: 120, damping: 20, mass: 0.6 });
  const glowTransform = useMotionTemplate`translate(${springX}px, ${springY}px)`;

  useEffect(() => {
    setCanFollow(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion);
  }, [reduceMotion]);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!canFollow || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  return (
    <section
      id="home"
      ref={heroRef}
      className={styles.hero}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => canFollow && setGlowActive(true)}
      onPointerLeave={() => setGlowActive(false)}
    >
      <div className={styles.mesh} aria-hidden="true">
        <span className={`${styles.blob} ${styles.blobBlue}`} />
        <span className={`${styles.blob} ${styles.blobViolet}`} />
        <span className={`${styles.blob} ${styles.blobTeal}`} />
      </div>

      {!reduceMotion && (
        <video
          className={styles.video}
          data-visible={videoReady}
          src="/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          aria-hidden="true"
        />
      )}
      <div className={styles.scrim} aria-hidden="true" />

      {canFollow && (
        <motion.div
          className={styles.glow}
          style={{ transform: glowTransform, opacity: glowActive ? 1 : 0 }}
          transition={{ opacity: { duration: 0.4, ease: EASE_OUT } }}
          aria-hidden="true"
        />
      )}

      <div className="container">
        <div className={styles.grid}>
          <div className={styles.inner}>
            <div className={`${styles.avatarRow} ${styles.piece}`}>
              <img src="/avatar.jpg" alt={profile.name} width={56} height={56} className={styles.avatar} />
              <p className="eyebrow">{profile.title}</p>
            </div>
            <h1 className={`${styles.name} ${styles.piece}`}>{profile.heroName}</h1>
            <p className={`${styles.subtitle} ${styles.piece}`}>{profile.summary}</p>

            <div className={`${styles.meta} ${styles.piece}`}>
              <span className="chip">{profile.location}</span>
              <span className="chip">4+ years experience</span>
              <span className="chip">Open to opportunities</span>
            </div>

            <div className={`${styles.actions} ${styles.piece}`}>
              <a
                href="#projects"
                className={`${styles.primaryButton} press`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View my work
              </a>
              <a href={`mailto:${profile.email}`} className={`${styles.secondaryButton} press`}>
                Get in touch
              </a>
            </div>
          </div>

          <HeroDevice />
        </div>
      </div>
    </section>
  );
}
