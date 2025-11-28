/**
 * Color transition and manipulation utilities
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

/**
 * Convert hex color to RGB object
 */
export function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : { r: 255, g: 255, b: 255 };
}

/**
 * Convert hex color to RGBA
 */
export function hexToRgba(hex: string, alpha: number = 1): RGBA {
  const rgb = hexToRgb(hex);
  return { ...rgb, a: alpha };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Convert RGBA to CSS string
 */
export function rgbaToString(rgba: RGBA): string {
  return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${rgba.a})`;
}

/**
 * Interpolate between two colors
 * @param color1 Start color (hex)
 * @param color2 End color (hex)
 * @param progress 0-1
 * @returns Interpolated hex color
 */
export function interpolateColor(color1: string, color2: string, progress: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = c1.r + (c2.r - c1.r) * progress;
  const g = c1.g + (c2.g - c1.g) * progress;
  const b = c1.b + (c2.b - c1.b) * progress;

  return rgbToHex(r, g, b);
}

/**
 * Create multi-stop gradient from color array
 */
export function createGradient(
  ctx: CanvasRenderingContext2D,
  colors: string[],
  x0: number,
  y0: number,
  x1?: number,
  y1?: number
): CanvasGradient {
  const gradient = x1 !== undefined && y1 !== undefined
    ? ctx.createLinearGradient(x0, y0, x1, y1)
    : ctx.createRadialGradient(x0, y0, 0, x0, y0, x1 || 100);

  colors.forEach((color, index) => {
    const stop = index / (colors.length - 1);
    gradient.addColorStop(stop, color);
  });

  return gradient;
}

/**
 * Lighten a color by percentage
 */
export function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  
  const r = Math.min(255, rgb.r + (255 - rgb.r) * (percent / 100));
  const g = Math.min(255, rgb.g + (255 - rgb.g) * (percent / 100));
  const b = Math.min(255, rgb.b + (255 - rgb.b) * (percent / 100));

  return rgbToHex(r, g, b);
}

/**
 * Darken a color by percentage
 */
export function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  
  const r = Math.max(0, rgb.r - rgb.r * (percent / 100));
  const g = Math.max(0, rgb.g - rgb.g * (percent / 100));
  const b = Math.max(0, rgb.b - rgb.b * (percent / 100));

  return rgbToHex(r, g, b);
}

/**
 * Create smooth color transition path with multiple stops
 */
export function createColorPath(colors: string[], steps: number): string[] {
  const path: string[] = [];
  
  for (let i = 0; i < steps; i++) {
    const progress = i / (steps - 1);
    const segmentIndex = Math.floor(progress * (colors.length - 1));
    const segmentProgress = (progress * (colors.length - 1)) - segmentIndex;
    
    if (segmentIndex >= colors.length - 1) {
      path.push(colors[colors.length - 1]);
    } else {
      path.push(interpolateColor(colors[segmentIndex], colors[segmentIndex + 1], segmentProgress));
    }
  }
  
  return path;
}

/**
 * Generate random color variation
 */
export function varyColor(hex: string, variation: number): string {
  const rgb = hexToRgb(hex);
  
  const vary = () => Math.random() * variation * 2 - variation;
  
  const r = Math.max(0, Math.min(255, rgb.r + vary()));
  const g = Math.max(0, Math.min(255, rgb.g + vary()));
  const b = Math.max(0, Math.min(255, rgb.b + vary()));

  return rgbToHex(r, g, b);
}
