import React from 'react';

/**
 * Returns true if the user has requested reduced motion via their OS/browser setting.
 * Use this to gate animations — skip them when this returns true.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = React.useState<boolean>(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
