// Mirrors the CSS custom properties in src/index.css (--ease-out, --ease-in-out,
// --ease-drawer). Motion needs numeric arrays, not CSS var() strings, so these
// are the single JS-side source of truth — import instead of retyping the curve.
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;
