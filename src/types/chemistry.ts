/**
 * Core TypeScript types for Chemistry Reaction Simulator
 */

export type ChemicalType = 'acid' | 'base' | 'salt' | 'metal' | 'nonmetal' | 'organic' | 'indicator';
export type HazardLevel = 'safe' | 'caution' | 'warning' | 'danger';
export type ReactionType = 'neutralization' | 'precipitation' | 'gas-evolution' | 'color-change' | 'combustion' | 'redox' | 'none';

export interface Chemical {
  id: string;
  name: string;
  formula: string;
  color: string; // hex color
  type: ChemicalType;
  hazard: HazardLevel;
  description?: string;
}

export interface VisualEffects {
  color?: string; // Resulting color
  colorChange?: boolean;
  bubbles?: 'none' | 'small' | 'medium' | 'large';
  precipitate?: {
    color: string;
    amount: 'light' | 'moderate' | 'heavy';
  };
  gas?: {
    type: string; // e.g., "CO2", "O2"
    intensity: number; // 0-10
  };
  smoke?: boolean;
  explosion?: boolean;
  glow?: boolean;
  temperatureChange?: number; // in °C, positive for exothermic, negative for endothermic
}

import { AnimationConfig } from './animations';

export interface Reaction {
  id: string;
  reactants: string[]; // Chemical IDs
  products: string[]; // Product formulas
  type: ReactionType;
  equation: string; // e.g., "HCl + NaOH → NaCl + H₂O"
  explanation: string;
  safety: string;
  effects: VisualEffects;
  requiresHeat?: boolean;
  requiresStir?: boolean;
  animationConfig?: AnimationConfig;
}

export interface ChemicalInBeaker {
  chemical: Chemical;
  amount: number; // arbitrary units
  addedAt: number; // timestamp
}

export interface BeakerState {
  chemicals: ChemicalInBeaker[];
  color: string; // current liquid color
  temperature: number; // in °C
  volume: number; // 0-100%
  activeEffects: VisualEffects;
  isHeated: boolean;
  isStirred: boolean;
}

export interface ExperimentHistory {
  id: string;
  timestamp: number;
  reactants: {
    name: string;
    formula: string;
  }[];
  reaction: Reaction | null;
  result: {
    success: boolean;
    message: string;
  };
}

export interface ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  lifetime: number;
  type: 'bubble' | 'precipitate' | 'smoke' | 'explosion' | 'gas-bubble' | 'spark' | 'flame' | 'frost' | 'swirl' | 'dissolve-cube' | 'electron';
  // Optional properties for advanced particles
  targetColor?: string;
  angle?: number;
  angularVelocity?: number;
  scale?: number;
  pulseSpeed?: number;
  glowIntensity?: number;
}
