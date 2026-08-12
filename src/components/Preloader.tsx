import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../lib/easing';
import styles from './Preloader.module.css';

const RINGS = [
  { inset: '42%', z: 99, delay: '0s' },
  { inset: '31.5%', z: 98, delay: '0.15s' },
  { inset: '21%', z: 97, delay: '0.3s' },
  { inset: '10.5%', z: 96, delay: '0.45s' },
  { inset: '0%', z: 95, delay: '0.6s' },
];

// Lemniscate of Gerono, sampled and rotated 45deg — two loops that share a
// single crossing point at the center, so the "X" is real geometry, not an
// illusion. Split into a right/left half so each loop can carry its own
// traveling light with an independent phase offset.
const LOOP_RIGHT_D =
  'M60,60 L63.14,60 L66.25,60.03 L69.29,60.09 L72.23,60.21 L75.05,60.41 L77.7,60.7 L80.17,61.1 L82.43,61.61 L84.46,62.25 L86.25,63.02 L87.77,63.93 L89.02,64.98 L89.99,66.16 L90.68,67.46 L91.1,68.88 L91.23,70.41 L91.1,72.03 L90.71,73.71 L90.08,75.45 L89.23,77.21 L88.18,78.98 L86.95,80.72 L85.56,82.42 L84.04,84.04 L82.42,85.56 L80.72,86.95 L78.98,88.18 L77.21,89.23 L75.45,90.08 L73.71,90.71 L72.03,91.1 L70.41,91.23 L68.88,91.1 L67.46,90.68 L66.16,89.99 L64.98,89.02 L63.93,87.77 L63.02,86.25 L62.25,84.46 L61.61,82.43 L61.1,80.17 L60.7,77.7 L60.41,75.05 L60.21,72.23 L60.09,69.29 L60.03,66.25 L60,63.14 L60,60';
const LOOP_LEFT_D =
  'M60,60 L60,56.86 L59.97,53.75 L59.91,50.71 L59.79,47.77 L59.59,44.95 L59.3,42.3 L58.9,39.83 L58.39,37.57 L57.75,35.54 L56.98,33.75 L56.07,32.23 L55.02,30.98 L53.84,30.01 L52.54,29.32 L51.12,28.9 L49.59,28.77 L47.97,28.9 L46.29,29.29 L44.55,29.92 L42.79,30.77 L41.02,31.82 L39.28,33.05 L37.58,34.44 L35.96,35.96 L34.44,37.58 L33.05,39.28 L31.82,41.02 L30.77,42.79 L29.92,44.55 L29.29,46.29 L28.9,47.97 L28.77,49.59 L28.9,51.12 L29.32,52.54 L30.01,53.84 L30.98,55.02 L32.23,56.07 L33.75,56.98 L35.54,57.75 L37.57,58.39 L39.83,58.9 L42.3,59.3 L44.95,59.59 L47.77,59.79 L50.71,59.91 L53.75,59.97 L56.86,60 L60,60';

function LoopLogo({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <svg className={styles.logo} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="preloaderLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd8ff" />
          <stop offset="50%" stopColor="#3a8dff" />
          <stop offset="100%" stopColor="#1c3fd6" />
        </linearGradient>
      </defs>
      <path id="preloaderLoopR" pathLength="1" className={styles.logoBase} d={LOOP_RIGHT_D} />
      <path id="preloaderLoopL" pathLength="1" className={styles.logoBase} d={LOOP_LEFT_D} />
      {!reduceMotion && (
        <>
          <use href="#preloaderLoopR" pathLength="1" className={styles.logoGlow} />
          <use href="#preloaderLoopL" pathLength="1" className={`${styles.logoGlow} ${styles.logoGlowB}`} />
        </>
      )}
    </svg>
  );
}

// Guaranteed minimum time on screen, independent of how fast the page
// actually loads — otherwise the ripple never gets a chance to play on a
// fast/cached connection. Real load time can still push it longer than this.
const MIN_DISPLAY_MS = 3000;

export function Preloader() {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  // Single source of truth for "how far along we are" — prevents the climb
  // loop and the finale from racing and overwriting each other.
  const progressRef = useRef(0);
  const finalizingRef = useRef(false);
  const assetsReadyRef = useRef(false);
  const mountTimeRef = useRef(0);
  if (mountTimeRef.current === 0) mountTimeRef.current = performance.now();

  const commitProgress = (next: number) => {
    const clamped = Math.max(progressRef.current, Math.min(100, next));
    progressRef.current = clamped;
    setProgress(clamped);
  };

  // Simulated climb toward 90% — asymptotic, never arrives on its own.
  // Keeps running for the full minimum display window; only stops once the
  // finale (jump to 100% + reveal) actually starts.
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      if (finalizingRef.current) return;
      const elapsed = Math.max(0, now - start);
      commitProgress(90 * (1 - Math.exp(-elapsed / 900)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function finalize() {
      if (finalizingRef.current) return;
      finalizingRef.current = true;
      commitProgress(100);
      setTimeout(() => setDone(true), 350);
    }

    function maybeFinalize() {
      if (!assetsReadyRef.current || finalizingRef.current) return;
      const elapsed = performance.now() - mountTimeRef.current;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      setTimeout(finalize, remaining);
    }

    function markAssetsReady() {
      if (assetsReadyRef.current) return;
      assetsReadyRef.current = true;
      maybeFinalize();
    }

    if (document.readyState === 'complete') {
      markAssetsReady();
    } else {
      window.addEventListener('load', markAssetsReady);
    }
    // Hard fallback: never trap the user behind this, even on a dead connection.
    const fallback = setTimeout(markAssetsReady, 8000);
    return () => {
      window.removeEventListener('load', markAssetsReady);
      clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = done ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.preloader}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.03 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.6, ease: EASE_OUT }}
        >
          <div className={styles.stage}>
            {RINGS.map((ring) => (
              <span
                key={ring.inset}
                className={styles.ring}
                style={{
                  inset: ring.inset,
                  zIndex: ring.z,
                  animation: reduceMotion ? 'none' : undefined,
                  animationDelay: reduceMotion ? undefined : ring.delay,
                }}
              />
            ))}
            <div className={styles.mark} style={{ animation: reduceMotion ? 'none' : undefined }}>
              <LoopLogo reduceMotion={reduceMotion} />
            </div>
          </div>
          <p className={styles.percent}>{Math.round(progress)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
