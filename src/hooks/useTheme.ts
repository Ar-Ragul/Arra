import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const STORAGE_KEY = 'theme';

function getStoredTheme(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

export function useTheme() {
  const [override, setOverride] = useState<Theme | null>(() => getStoredTheme());
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (override) {
      document.documentElement.setAttribute('data-theme', override);
      localStorage.setItem(STORAGE_KEY, override);
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [override]);

  const isDark = override ? override === 'dark' : systemDark;
  const toggle = () => setOverride(isDark ? 'light' : 'dark');

  return { isDark, toggle };
}
