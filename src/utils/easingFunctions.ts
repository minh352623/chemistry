/**
 * Easing functions for smooth animations
 */

export type EasingFunctionType = (t: number) => number;

/**
 * Linear easing (no easing)
 */
export function linear(t: number): number {
  return t;
}

/**
 * Ease in (accelerating from zero velocity)
 */
export function easeIn(t: number): number {
  return t * t;
}

/**
 * Ease out (decelerating to zero velocity)
 */
export function easeOut(t: number): number {
  return t * (2 - t);
}

/**
 * Ease in-out (acceleration until halfway, then deceleration)
 */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Ease in cubic
 */
export function easeInCubic(t: number): number {
  return t * t * t;
}

/**
 * Ease out cubic
 */
export function easeOutCubic(t: number): number {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
}

/**
 * Ease in-out cubic
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

/**
 * Elastic easing (like a rubber band)
 */
export function elastic(t: number): number {
  if (t === 0 || t === 1) return t;
  
  const p = 0.3;
  const s = p / 4;
  const t1 = t - 1;
  
  return -(Math.pow(2, 10 * t1) * Math.sin((t1 - s) * (2 * Math.PI) / p));
}

/**
 * Elastic out
 */
export function elasticOut(t: number): number {
  if (t === 0 || t === 1) return t;
  
  const p = 0.3;
  const s = p / 4;
  
  return Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1;
}

/**
 * Bounce easing (bouncing ball effect)
 */
export function bounce(t: number): number {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    const t1 = t - 1.5 / 2.75;
    return 7.5625 * t1 * t1 + 0.75;
  } else if (t < 2.5 / 2.75) {
    const t1 = t - 2.25 / 2.75;
    return 7.5625 * t1 * t1 + 0.9375;
  } else {
    const t1 = t - 2.625 / 2.75;
    return 7.5625 * t1 * t1 + 0.984375;
  }
}

/**
 * Sine easing
 */
export function easeSine(t: number): number {
  return 1 - Math.cos((t * Math.PI) / 2);
}

/**
 * Sine out
 */
export function easeSineOut(t: number): number {
  return Math.sin((t * Math.PI) / 2);
}

/**
 * Back easing (overshoots then returns)
 */
export function easeBack(t: number): number {
  const s = 1.70158;
  return t * t * ((s + 1) * t - s);
}

/**
 * Back out
 */
export function easeBackOut(t: number): number {
  const s = 1.70158;
  const t1 = t - 1;
  return t1 * t1 * ((s + 1) * t1 + s) + 1;
}

/**
 * Get easing function by name
 */
export function getEasingFunction(name: string): EasingFunctionType {
  switch (name) {
    case 'linear': return linear;
    case 'ease-in': return easeIn;
    case 'ease-out': return easeOut;
    case 'ease-in-out': return easeInOut;
    case 'ease-in-cubic': return easeInCubic;
    case 'ease-out-cubic': return easeOutCubic;
    case 'ease-in-out-cubic': return easeInOutCubic;
    case 'elastic': return elastic;
    case 'elastic-out': return elasticOut;
    case 'bounce': return bounce;
    case 'sine': return easeSine;
    case 'sine-out': return easeSineOut;
    case 'back': return easeBack;
    case 'back-out': return easeBackOut;
    default: return linear;
  }
}

/**
 * Apply easing to a value range
 */
export function applyEasing(
  start: number,
  end: number,
  progress: number,
  easingFn: EasingFunctionType = easeInOut
): number {
  const easedProgress = easingFn(Math.max(0, Math.min(1, progress)));
  return start + (end - start) * easedProgress;
}
