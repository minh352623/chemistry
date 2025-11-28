/**
 * Animation types and configurations for Chemistry Reactions
 */

export type AnimationType = 
  | 'neutralization'
  | 'precipitation'
  | 'gas-formation'
  | 'redox'
  | 'combustion'
  | 'endothermic'
  | 'double-displacement'
  | 'dissolution'
  | 'electrochemical';

export type EasingFunction = 
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'elastic'
  | 'bounce';

export interface ColorTransitionConfig {
  from: string;
  to: string;
  duration: number;
  easing?: EasingFunction;
  steps?: number; // For multi-step transitions
}

export interface BubbleAnimationConfig {
  speed: 'slow' | 'medium' | 'fast';
  density: number; // 0-1
  size: 'small' | 'medium' | 'large';
  burstAtTop?: boolean;
  popParticles?: boolean;
}

export interface GlowEffectConfig {
  color: string;
  intensity: number; // 0-1
  duration: number;
  pulse?: boolean;
  frequency?: number; // Hz for pulsing
}

export interface PrecipitateConfig {
  particleSize: [number, number]; // min, max
  fallSpeed: 'slow' | 'medium' | 'fast';
  density: 'light' | 'moderate' | 'heavy';
  cloudiness: number; // 0-1
  settleAnimation: boolean;
  color: string;
}

export interface GasEffectConfig {
  speed: 'slow' | 'medium' | 'fast';
  burstAtTop: boolean;
  density: number; // 0-1
  popParticles: boolean;
  steamEffect?: {
    rise: boolean;
    disperse: boolean;
    intensity: number;
  };
}

export interface SparkEffectConfig {
  count: number;
  color: string;
  size: number;
  lifetime: number;
  sparkleIntensity?: number;
}

export interface FlashEffectConfig {
  color: string;
  intensity: number; // 0-1
  duration: number;
  fadeOut: boolean;
}

export interface FlameEffectConfig {
  flicker: boolean;
  colors: string[];
  height: number; // 0-1, fraction of beaker height
  duration: number;
  particles?: boolean;
}

export interface FrostEffectConfig {
  color: string;
  opacity: number;
  crystalParticles: boolean;
  duration: number;
  mistEffect?: {
    color: string;
    rise: boolean;
    density: number;
  };
}

export interface SwirlEffectConfig {
  colors: string[];
  pattern: 'spiral' | 'vortex' | 'figure-8';
  collisionPoint: { x: number; y: number }; // normalized 0-1
  resultColor: string;
  particleCount: number;
  spiralSpeed: 'slow' | 'medium' | 'fast';
}

export interface DissolveEffectConfig {
  cubeSize: number;
  position: { x: number; y: number };
  dissolveRate: number; // 0-1 per frame
  particlesOnDissolve: boolean;
  rippleEffect?: {
    waveCount: number;
    spacing: number;
  };
}

export interface ElectronFlowConfig {
  paths: string[]; // e.g., ['anode-to-cathode']
  particleCount: number;
  color: string;
  speed: 'slow' | 'medium' | 'fast';
  chargeSparkTrails?: {
    intensity: number;
    color: string;
  };
}

export interface AnimationConfig {
  type: AnimationType;
  duration: number; // total animation duration in ms
  delay?: number; // delay before starting
  
  // Effect configurations
  colorTransition?: ColorTransitionConfig;
  bubbles?: BubbleAnimationConfig;
  glow?: GlowEffectConfig;
  precipitate?: PrecipitateConfig;
  gas?: GasEffectConfig;
  sparks?: SparkEffectConfig;
  flash?: FlashEffectConfig;
  flame?: FlameEffectConfig;
  frost?: FrostEffectConfig;
  swirl?: SwirlEffectConfig;
  dissolve?: DissolveEffectConfig;
  electronFlow?: ElectronFlowConfig;
  
  // Additional modifiers
  temperatureEffect?: 'warm' | 'cool' | 'hot' | 'cold';
  soundEffect?: string; // Future: sound file name
}

export interface AnimationState {
  isPlaying: boolean;
  startTime: number;
  currentTime: number;
  progress: number; // 0-1
  config: AnimationConfig;
}

export interface AnimationTimeline {
  effects: Array<{
    effect: keyof AnimationConfig;
    startTime: number;
    duration: number;
  }>;
}
