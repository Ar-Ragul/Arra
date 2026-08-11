import type { ReactNode } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';

type RevealProps = {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'li';
  className?: string;
};

export function Reveal({ children, delay = 0, as = 'div', className }: RevealProps) {
  const { ref, visible } = useScrollReveal();
  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={['reveal', className].filter(Boolean).join(' ')}
      data-visible={visible}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </Tag>
  );
}
