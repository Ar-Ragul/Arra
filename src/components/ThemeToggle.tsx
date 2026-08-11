import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { EASE_OUT } from '../lib/easing';
import { useTheme } from '../hooks/useTheme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const reduceMotion = useReducedMotion();
  const spin = reduceMotion ? 0 : 90;
  const shrink = reduceMotion ? 1 : 0.6;

  return (
    <button
      type="button"
      className={`${styles.toggle} press`}
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.svg
            key="moon"
            viewBox="0 0 24 24"
            fill="currentColor"
            initial={{ opacity: 0, rotate: -spin, scale: shrink }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: spin, scale: shrink }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <path d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 1 0 20.354 15.354Z" />
          </motion.svg>
        ) : (
          <motion.svg
            key="sun"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            initial={{ opacity: 0, rotate: -spin, scale: shrink }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: spin, scale: shrink }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          >
            <circle cx="12" cy="12" r="4.2" />
            <line x1="12" y1="1.5" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22.5" />
            <line x1="1.5" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22.5" y2="12" />
            <line x1="4.4" y1="4.4" x2="6.2" y2="6.2" />
            <line x1="17.8" y1="17.8" x2="19.6" y2="19.6" />
            <line x1="4.4" y1="19.6" x2="6.2" y2="17.8" />
            <line x1="17.8" y1="6.2" x2="19.6" y2="4.4" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
