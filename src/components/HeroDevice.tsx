import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import styles from './HeroDevice.module.css';

type Chip = {
  label: string;
  depth: number;
  delay: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  center?: boolean;
};

// Symmetric pentagon around the laptop: two corners up top, two mid-height
// at the sides, one anchored bottom-center below the base.
const CHIPS: Chip[] = [
  { label: 'React', top: '0%', left: '-4%', depth: 55, delay: '0s' },
  { label: 'TypeScript', top: '0%', right: '-4%', depth: 85, delay: '0.5s' },
  { label: 'Node.js', top: '48%', left: '-15%', depth: 45, delay: '1s' },
  { label: 'Python', top: '48%', right: '-15%', depth: 70, delay: '1.5s' },
  { label: 'AWS', bottom: '-8%', left: '50%', depth: 60, delay: '2s', center: true },
];

function ChipLayer({ chip, scrollY, reduceMotion }: { chip: Chip; scrollY: MotionValue<number>; reduceMotion: boolean | null }) {
  const parallax = useTransform(scrollY, [0, 420], reduceMotion ? [0, 0] : [0, -chip.depth]);
  const transform = useMotionTemplate`translateY(${parallax}px)`;

  return (
    <motion.div className={styles.chipLayer} style={{ transform }}>
      <span
        className={styles.chip}
        style={{
          top: chip.top,
          bottom: chip.bottom,
          left: chip.left,
          right: chip.right,
          translate: chip.center ? '-50% 0' : undefined,
          animationDelay: chip.delay,
        }}
      >
        <span className={styles.chipDot} />
        {chip.label}
      </span>
    </motion.div>
  );
}

export function HeroDevice() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const lidRotate = useTransform(scrollY, [0, 380], reduceMotion ? [0, 0] : [-10, 0]);
  const liftY = useTransform(scrollY, [0, 380], reduceMotion ? [0, 0] : [14, 0]);
  const stageScale = useTransform(scrollY, [0, 380], reduceMotion ? [1, 1] : [0.98, 1]);
  const codeOpacity = useTransform(scrollY, [0, 380], reduceMotion ? [1, 1] : [0.65, 1]);

  const laptopTransform = useMotionTemplate`translateY(${liftY}px) scale(${stageScale})`;
  const screenTransform = useMotionTemplate`rotateX(${lidRotate}deg)`;

  return (
    <div className={styles.stage}>
      <span className={`${styles.orb} ${styles.orbBlue}`} aria-hidden="true" />
      <span className={`${styles.orb} ${styles.orbViolet}`} aria-hidden="true" />

      <motion.div className={styles.laptopWrap} style={{ transform: laptopTransform }}>
        <motion.div className={styles.screen} style={{ transform: screenTransform }}>
          <div className={styles.screenInner}>
            <div className={styles.chrome}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
              <span className={styles.tabLabel}>portfolio.tsx</span>
            </div>
            <motion.pre className={styles.code} style={{ opacity: codeOpacity }} aria-hidden="true">
              <span className={styles.kw}>const</span> <span className={styles.fn}>engineer</span>{' '}
              <span className={styles.punc}>= {'{'}</span>
              {'\n'}
              <span className={styles.indent}>
                <span className={styles.prop}>name</span>
                <span className={styles.punc}>: </span>
                <span className={styles.str}>'Ragul Athur Raghunath'</span>
                <span className={styles.punc}>,</span>
              </span>
              {'\n'}
              <span className={styles.indent}>
                <span className={styles.prop}>experience</span>
                <span className={styles.punc}>: </span>
                <span className={styles.str}>'4+ years'</span>
                <span className={styles.punc}>,</span>
              </span>
              {'\n'}
              <span className={styles.indent}>
                <span className={styles.prop}>stack</span>
                <span className={styles.punc}>: [</span>
                <span className={styles.str}>'React'</span>
                <span className={styles.punc}>, </span>
                <span className={styles.str}>'Node'</span>
                <span className={styles.punc}>, </span>
                <span className={styles.str}>'AWS'</span>
                <span className={styles.punc}>],</span>
              </span>
              {'\n'}
              <span className={styles.indent}>
                <span className={styles.prop}>shipsWith</span>
                <span className={styles.punc}>: </span>
                <span className={styles.str}>'craft'</span>
                <span className={styles.punc}>,</span>
              </span>
              {'\n'}
              <span className={styles.punc}>{'}'}</span>
              {'\n'}
              <span className={styles.com}>// open to opportunities</span>
            </motion.pre>
          </div>
        </motion.div>
        <div className={styles.base} />
      </motion.div>

      {CHIPS.map((chip) => (
        <ChipLayer key={chip.label} chip={chip} scrollY={scrollY} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}
