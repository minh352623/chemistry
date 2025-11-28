/**
 * Chemistry helper utilities
 */

/**
 * Format chemical formula with subscripts
 * Converts H2O to H₂O, CuSO4 to CuSO₄, etc.
 */
export function formatFormula(formula: string): string {
  const subscriptMap: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
  };

  return formula.replace(/[0-9]/g, (digit) => subscriptMap[digit] || digit);
}

/**
 * Parse formula that already has subscript characters and extract element counts
 * For display purposes
 */
export function parseFormula(formula: string): { element: string; count: number }[] {
  // This is a simplified parser - in production you'd want a more robust one
  const elements: { element: string; count: number }[] = [];
  const regex = /([A-Z][a-z]?)([₀-₉0-9]*)/g;
  
  let match;
  while ((match = regex.exec(formula)) !== null) {
    const element = match[1];
    const countStr = match[2];
    
    // Convert subscript to regular number
    const count = countStr ? parseInt(convertSubscriptToNumber(countStr)) : 1;
    
    elements.push({ element, count });
  }
  
  return elements;
}

/**
 * Convert subscript numbers to regular numbers
 */
function convertSubscriptToNumber(subscript: string): string {
  const subscriptMap: Record<string, string> = {
    '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
    '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'
  };

  return subscript.replace(/[₀-₉]/g, (char) => subscriptMap[char] || char);
}

/**
 * Interpolate between two hex colors
 */
export function interpolateTwoColors(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);

  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));

  return rgbToHex(r, g, b);
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
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
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Calculate overall hazard level from multiple chemicals
 */
export function calculateHazardLevel(hazards: string[]): string {
  const levels = ['safe', 'caution', 'warning', 'danger'];
  let maxLevel = 0;

  hazards.forEach(hazard => {
    const level = levels.indexOf(hazard);
    if (level > maxLevel) maxLevel = level;
  });

  return levels[maxLevel];
}

/**
 * Get hazard color for UI display
 */
export function getHazardColor(hazard: string): string {
  switch (hazard) {
    case 'safe': return '#22c55e'; // green
    case 'caution': return '#eab308'; // yellow
    case 'warning': return '#f97316'; // orange
    case 'danger': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
}

/**
 * Format timestamp to readable date string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
