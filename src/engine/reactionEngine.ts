import { Chemical, Reaction, VisualEffects } from '@/types/chemistry';
import chemicalsData from '@/data/chemicals.json';
import reactionsData from '@/data/reactions.json';

/**
 * Chemistry Reaction Engine
 * Evaluates chemical combinations and returns reaction data
 */

class ReactionEngine {
  private chemicals: Chemical[];
  private reactions: Reaction[];

  constructor() {
    this.chemicals = chemicalsData as Chemical[];
    this.reactions = reactionsData as Reaction[];
  }

  /**
   * Get all available chemicals
   */
  getChemicals(): Chemical[] {
    return this.chemicals;
  }

  /**
   * Get chemical by ID
   */
  getChemical(id: string): Chemical | undefined {
    return this.chemicals.find(c => c.id === id);
  }

  /**
   * Find a reaction given an array of chemical IDs
   * Order-independent matching
   */
  findReaction(chemicalIds: string[], conditions?: { heated?: boolean; stirred?: boolean }): Reaction | null {
    // Sort both arrays for order-independent comparison
    const sortedInput = [...chemicalIds].sort();

    for (const reaction of this.reactions) {
      const sortedReactants = [...reaction.reactants].sort();

      // Check if arrays match
      if (this.arraysEqual(sortedInput, sortedReactants)) {
        // Check if conditions are met
        if (reaction.requiresHeat && !conditions?.heated) {
          continue; // Skip if heat is required but not provided
        }
        return reaction;
      }
    }

    return null;
  }

  /**
   * Evaluate chemicals in beaker and return reaction result
   */
  evaluateReaction(
    chemicalIds: string[],
    conditions?: { heated?: boolean; stirred?: boolean }
  ): {
    reaction: Reaction | null;
    success: boolean;
    message: string;
  } {
    if (chemicalIds.length < 2) {
      return {
        reaction: null,
        success: false,
        message: 'Add at least 2 chemicals to create a reaction.'
      };
    }

    const reaction = this.findReaction(chemicalIds, conditions);

    if (!reaction) {
      return {
        reaction: null,
        success: false,
        message: 'No reaction occurs with these chemicals under current conditions.'
      };
    }

    if (reaction.requiresHeat && !conditions?.heated) {
      return {
        reaction: null,
        success: false,
        message: `This reaction requires heating. Click the "Heat" button and try again.`
      };
    }

    return {
      reaction,
      success: true,
      message: `Reaction occurred: ${reaction.type}`
    };
  }

  /**
   * Calculate the resulting color when mixing chemicals
   * Blends colors with weighted averaging
   */
  blendColors(chemicalIds: string[]): string {
    const colors = chemicalIds
      .map(id => this.getChemical(id)?.color)
      .filter(Boolean) as string[];

    if (colors.length === 0) return '#FFFFFF';
    if (colors.length === 1) return colors[0];

    return this.interpolateColors(colors);
  }

  /**
   * Interpolate multiple hex colors
   */
  private interpolateColors(colors: string[]): string {
    const rgbValues = colors.map(this.hexToRgb);
    
    const avg = {
      r: Math.round(rgbValues.reduce((sum, rgb) => sum + rgb.r, 0) / rgbValues.length),
      g: Math.round(rgbValues.reduce((sum, rgb) => sum + rgb.g, 0) / rgbValues.length),
      b: Math.round(rgbValues.reduce((sum, rgb) => sum + rgb.b, 0) / rgbValues.length)
    };

    return this.rgbToHex(avg.r, avg.g, avg.b);
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
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
  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  /**
   * Helper to compare arrays
   */
  private arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * Get default visual effects for a mix without reaction
   */
  getDefaultEffects(chemicalIds: string[]): VisualEffects {
    return {
      color: this.blendColors(chemicalIds),
      bubbles: 'none',
      temperatureChange: 0
    };
  }
}

// Export singleton instance
export const reactionEngine = new ReactionEngine();
