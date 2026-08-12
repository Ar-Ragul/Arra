import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react';
import { profile } from '../data/resume';
import { EASE_OUT } from '../lib/easing';
import styles from './ContactBadge.module.css';

const MAX_SWING = 42;
// A lanyard can stretch a good deal when pulled down, but strongly resists
// being pushed up past its resting length — different "give" per direction.
const MAX_PULL_DOWN = 90;
const MAX_PULL_UP = 22;
// Must match .strap's CSS height — the scale factor that makes the strap's
// rendered length track the card's actual vertical offset.
const STRAP_HEIGHT = 42;

// Diminishing-returns elastic response (iOS-style rubber banding): the further
// past rest you drag, the less additional travel you get per pixel of input,
// asymptotically approaching `max` instead of hard-clamping.
function rubberband(delta: number, max: number) {
  return (max * delta) / (max + Math.abs(delta));
}

type Sample = { rotate: number; pull: number; t: number };

export function ContactBadge() {
  const reduceMotion = useReducedMotion();
  const [flipped, setFlipped] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const rotate = useMotionValue(0);
  const pull = useMotionValue(0);
  // The strap's top edge is pinned to the fixed clip, so it has to grow to
  // close the gap as the card is pulled further away — otherwise the strap
  // stays a fixed length while the card drifts off the end of it.
  const strapScale = useTransform(pull, (p) => Math.max(0.45, 1 + p / STRAP_HEIGHT));
  const draggingRef = useRef(false);
  const dragStartRef = useRef<{ clientY: number; pullBase: number } | null>(null);
  const lastSampleRef = useRef<Sample | null>(null);
  const idleRotateRef = useRef<AnimationPlaybackControls | null>(null);
  const idlePullRef = useRef<AnimationPlaybackControls | null>(null);

  const stopIdle = () => {
    idleRotateRef.current?.stop();
    idlePullRef.current?.stop();
  };

  const startIdle = () => {
    if (reduceMotion) return;
    idleRotateRef.current = animate(rotate, [0, 2.4, -2.4, 0], {
      duration: 7,
      repeat: Infinity,
      ease: 'easeInOut',
    });
    idlePullRef.current = animate(pull, [0, 3, 0], {
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut',
    });
  };

  useEffect(() => {
    stopIdle();
    if (reduceMotion) {
      rotate.set(0);
      pull.set(0);
      return;
    }
    startIdle();
    return stopIdle;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const angleFromPointer = (clientX: number, clientY: number) => {
    const stage = stageRef.current;
    if (!stage) return 0;
    const rect = stage.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const anchorY = rect.top;
    const dx = clientX - anchorX;
    const dy = Math.max(1, clientY - anchorY);
    // CSS rotate() is clockwise-positive, which swings a hanging bottom edge
    // *left* for a positive angle — negate so a rightward pointer maps to a
    // rightward swing instead of the mirrored direction.
    const deg = (Math.atan2(-dx, dy) * 180) / Math.PI;
    return Math.max(-MAX_SWING, Math.min(MAX_SWING, deg));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (reduceMotion) return;
    if ((e.target as HTMLElement).closest('button, a')) return;
    stopIdle();
    draggingRef.current = true;
    dragStartRef.current = { clientY: e.clientY, pullBase: pull.get() };
    lastSampleRef.current = { rotate: rotate.get(), pull: pull.get(), t: performance.now() };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current || !dragStartRef.current) return;

    const angle = angleFromPointer(e.clientX, e.clientY);
    rotate.set(angle);

    const rawPull = dragStartRef.current.pullBase + (e.clientY - dragStartRef.current.clientY);
    const nextPull = rawPull >= 0 ? rubberband(rawPull, MAX_PULL_DOWN) : rubberband(rawPull, MAX_PULL_UP);
    pull.set(nextPull);

    lastSampleRef.current = { rotate: angle, pull: nextPull, t: performance.now() };
  };

  const handlePointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    dragStartRef.current = null;

    let rotateVelocity = 0;
    let pullVelocity = 0;
    if (lastSampleRef.current) {
      const dt = Math.max(16, performance.now() - lastSampleRef.current.t) / 1000;
      rotateVelocity = (rotate.get() - lastSampleRef.current.rotate) / dt;
      pullVelocity = (pull.get() - lastSampleRef.current.pull) / dt;
    }

    // Both axes release independently and settle at different times — only
    // resume idle sway once neither is still mid-spring, or the idle
    // animation would yank whichever axis is still easing back to 0.
    let pending = 2;
    const onEitherSettled = () => {
      pending -= 1;
      if (pending === 0) startIdle();
    };

    animate(rotate, 0, {
      type: 'spring',
      stiffness: 90,
      damping: 9,
      velocity: Math.max(-500, Math.min(500, rotateVelocity)),
      onComplete: onEitherSettled,
    });
    animate(pull, 0, {
      type: 'spring',
      stiffness: 140,
      damping: 12,
      velocity: Math.max(-800, Math.min(800, pullVelocity)),
      onComplete: onEitherSettled,
    });
  };

  return (
    <div className={styles.stage} ref={stageRef}>
      <span className={styles.clip} aria-hidden="true" />
      <motion.div
        className={styles.swing}
        style={{ rotate }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <motion.span className={styles.strap} style={{ scaleY: strapScale }} aria-hidden="true" />

        <motion.div className={styles.cardGroup} style={{ y: pull }}>
          <span className={styles.grommet} aria-hidden="true" />

          <motion.div
            className={styles.card}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0.2, ease: EASE_OUT }
                : { type: 'spring', stiffness: 300, damping: 30 }
            }
          >
            <div className={styles.face}>
              <img
                src="/avatar.jpg"
                alt={profile.name}
                width={76}
                height={76}
                draggable={false}
                className={styles.photo}
              />

              <p className={styles.name}>{profile.heroName}</p>
              <p className={styles.role}>{profile.title}</p>
              <div className={styles.status}>
                <span className={styles.pulseDot} aria-hidden="true" />
                Available for work
              </div>

              <div className={styles.bottomGroup}>
                <span className={styles.barcode} aria-hidden="true" />
                <button type="button" className={`${styles.ctaButton} press`} onClick={() => setFlipped(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <path d="m4 6 8 7 8-7" />
                  </svg>
                  Contact Me
                </button>
              </div>
            </div>

            <div className={styles.back}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => setFlipped(false)}
                aria-label="Back to badge"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="m12 19-7-7 7-7" />
                </svg>
              </button>

              <p className={styles.backTitle}>Let's talk</p>

              <div className={styles.backLinks}>
                <a href={`mailto:${profile.email}`} className={styles.backLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16v16H4z" />
                    <path d="m4 6 8 7 8-7" />
                  </svg>
                  <span>{profile.email}</span>
                </a>
                <a href={`tel:${profile.phone}`} className={styles.backLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{profile.phone}</span>
                </a>
                <a href={profile.github} target="_blank" rel="noreferrer" className={styles.backLink}>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 .3a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
