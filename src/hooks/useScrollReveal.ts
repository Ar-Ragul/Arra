import { useEffect, useRef, useState } from 'react';

export function useScrollReveal<T extends HTMLElement>(margin = '-80px') {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px`, threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, visible };
}
