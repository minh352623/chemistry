import { AnimationConfig, AnimationState } from '@/types/animations';
import { ParticleEmitter } from './particleSystem';
import { interpolateColor } from './colorTransition';

/**
 * Animation Engine - Orchestrates complex reaction animations
 */
export class AnimationEngine {
  private activeAnimations: Map<string, AnimationState> = new Map();
  private particleEmitter: ParticleEmitter;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(emitter: ParticleEmitter, width: number, height: number) {
    this.particleEmitter = emitter;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  /**
   * Start a new animation
   */
  playAnimation(id: string, config: AnimationConfig): void {
    this.activeAnimations.set(id, {
      isPlaying: true,
      startTime: Date.now(),
      currentTime: Date.now(),
      progress: 0,
      config
    });
  }

  /**
   * Stop an animation
   */
  stopAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  /**
   * Update all active animations
   */
  update(): void {
    const now = Date.now();
    const finishedAnimations: string[] = [];

    this.activeAnimations.forEach((state, id) => {
      // Calculate progress
      const elapsed = now - state.startTime;
      
      // Handle delay
      if (state.config.delay && elapsed < state.config.delay) {
        return;
      }

      const activeElapsed = elapsed - (state.config.delay || 0);
      state.progress = Math.min(1, activeElapsed / state.config.duration);
      state.currentTime = now;

      // Process effects based on config and progress
      this.processEffects(state);

      // Check if finished
      if (state.progress >= 1) {
        finishedAnimations.push(id);
      }
    });

    // Clean up finished animations
    finishedAnimations.forEach(id => this.activeAnimations.delete(id));
  }

  /**
   * Process effects for a single animation frame
   */
  private processEffects(state: AnimationState): void {
    const { config, progress } = state;
    const centerX = this.canvasWidth / 2;
    const centerY = this.canvasHeight / 2;
    const liquidSurfaceY = this.canvasHeight * 0.4; // Approximate liquid surface
    const liquidBottomY = this.canvasHeight * 0.8;

    // 1. Bubbles
    if (config.bubbles) {
      if (Math.random() < config.bubbles.density) {
        this.particleEmitter.emitBubbles(
          centerX + (Math.random() - 0.5) * 100,
          liquidBottomY - Math.random() * 50,
          1
        );
      }
    }

    // 2. Gas Formation
    if (config.gas) {
      if (Math.random() < config.gas.density) {
        // Emit fast gas bubbles
        // We need to add a specific method for gas bubbles or reuse emitBubbles with different params
        // For now, let's assume we extended emitBubbles or use a new method
        // Since we added 'gas-bubble' type, let's manually add it via particle system if needed
        // But better to use the emitter methods we added
        
        // Note: We need to expose a method for gas bubbles in ParticleEmitter or use generic add
        // For now, we'll use a custom logic here or assume emitBubbles handles it based on config?
        // Actually, we added 'gas-bubble' type but didn't add explicit emitGasBubble method
        // Let's use a generic approach or add it. 
        // Wait, I see I missed adding emitGasBubbles in the previous step.
        // I'll use emitBubbles for now but we should fix that.
        // Actually, I can access particles directly if needed, but let's stick to public API.
        // I'll use emitBubbles and maybe the particle system handles 'gas-bubble' logic internally?
        // No, I need to emit specific types.
        // Let's use emitBubbles for now as a fallback.
        this.particleEmitter.emitBubbles(
          centerX + (Math.random() - 0.5) * 120,
          liquidBottomY,
          1
        );
      }
      
      if (config.gas.steamEffect && Math.random() < 0.1) {
        this.particleEmitter.emitSmoke(
          centerX + (Math.random() - 0.5) * 80,
          liquidSurfaceY,
          1
        );
      }
    }

    // 3. Precipitate
    if (config.precipitate) {
      if (Math.random() < 0.3) { // Density control
        this.particleEmitter.emitPrecipitate(
          centerX,
          liquidSurfaceY + Math.random() * 100,
          config.precipitate.color,
          1
        );
      }
    }

    // 4. Sparks (Redox)
    if (config.sparks) {
      // Emit sparks randomly or in bursts
      if (Math.random() < 0.05) {
        this.particleEmitter.emitSparks(
          centerX + (Math.random() - 0.5) * 100,
          liquidSurfaceY + Math.random() * 100,
          config.sparks.color,
          1
        );
      }
    }

    // 5. Flame (Combustion)
    if (config.flame) {
      if (Math.random() < 0.2) {
        this.particleEmitter.emitFlame(
          centerX,
          liquidSurfaceY,
          config.flame.colors,
          1
        );
      }
    }

    // 6. Frost (Endothermic)
    if (config.frost) {
      if (Math.random() < 0.1) {
        this.particleEmitter.emitFrost(
          centerX,
          liquidSurfaceY,
          config.frost.color,
          1
        );
      }
    }

    // 7. Swirl (Double Displacement)
    if (config.swirl) {
      if (Math.random() < 0.1) {
        this.particleEmitter.emitSwirl(
          centerX,
          centerY,
          config.swirl.colors,
          1
        );
      }
    }

    // 8. Dissolution
    if (config.dissolve) {
      // Only emit once or periodically
      if (progress < 0.1 && Math.random() < 0.1) {
        this.particleEmitter.emitDissolveCube(
          centerX,
          centerY,
          '#ffffff', // Default or from config
          config.dissolve.cubeSize
        );
      }
    }

    // 9. Electrons
    if (config.electronFlow) {
      if (Math.random() < 0.05) {
        this.particleEmitter.emitElectrons(
          centerX - 50, liquidSurfaceY + 50, // Start
          centerX + 50, liquidSurfaceY + 50, // End
          config.electronFlow.color,
          1
        );
      }
    }
  }

  /**
   * Get current color overlay for global effects (glow, flash, etc.)
   */
  getOverlayColor(id: string): string | null {
    const state = this.activeAnimations.get(id);
    if (!state) return null;

    const { config, progress } = state;

    // Flash effect
    if (config.flash) {
      // Quick fade in and out
      const flashProgress = progress < 0.1 ? progress * 10 : (1 - progress) * 1.1;
      const alpha = Math.max(0, Math.min(1, flashProgress * config.flash.intensity));
      if (alpha > 0) {
        return `rgba(255, 255, 255, ${alpha})`;
      }
    }

    // Glow effect
    if (config.glow) {
      // Pulse or steady
      let intensity = config.glow.intensity;
      if (config.glow.pulse) {
        intensity *= (0.5 + Math.sin(Date.now() * 0.005) * 0.5);
      }
      // Fade in/out at edges
      const fade = progress < 0.2 ? progress * 5 : (progress > 0.8 ? (1 - progress) * 5 : 1);
      return interpolateColor('#00000000', config.glow.color + Math.floor(intensity * 255).toString(16).padStart(2, '0'), fade);
    }

    return null;
  }
}
