import { ParticleConfig } from '@/types/chemistry';

/**
 * Particle class for beaker visual effects
 */
export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  lifetime: number;
  maxLifetime: number;
  type: 'bubble' | 'precipitate' | 'smoke' | 'explosion' | 'gas-bubble' | 'spark' | 'flame' | 'frost' | 'swirl' | 'dissolve-cube' | 'electron';
  
  // Additional properties for enhanced particles
  targetColor?: string; // For color transitions
  angle?: number; // For swirl particles
  angularVelocity?: number; // For rotation
  scale?: number; // For size pulsing
  pulseSpeed?: number; // For pulsing effects
  glowIntensity?: number; // For glow effects

  constructor(config: ParticleConfig) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.radius = config.radius;
    this.color = config.color;
    this.alpha = config.alpha;
    this.lifetime = config.lifetime;
    this.maxLifetime = config.lifetime;
    this.type = config.type;
  }

  update(deltaTime: number = 1): void {
    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Apply physics based on type
    switch (this.type) {
      case 'bubble':
        // Bubbles rise and wobble
        this.vy -= 0.05; // Buoyancy
        this.vx += (Math.random() - 0.5) * 0.2; // Wobble
        this.vx *= 0.98; // Damping
        break;

      case 'gas-bubble':
        // Fast rising gas bubbles
        this.vy -= 0.15; // Stronger buoyancy
        this.vx += (Math.random() - 0.5) * 0.3; // More wobble
        this.vx *= 0.97;
        this.radius *= 1.002; // Expand slightly
        break;

      case 'precipitate':
        // Precipitates fall
        this.vy += 0.1; // Gravity
        this.vy *= 0.95; // Terminal velocity
        break;

      case 'smoke':
        // Smoke rises and disperses
        this.vy -= 0.08;
        this.vx += (Math.random() - 0.5) * 0.15;
        this.radius += 0.05; // Expand
        break;

      case 'explosion':
        // Explosion particles slow down
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vy += 0.05; // Slight gravity
        break;

      case 'spark':
        // Sparks with quick decay
        this.vx *= 0.92;
        this.vy *= 0.92;
        this.vy += 0.08; // Gravity
        if (this.glowIntensity) {
          this.glowIntensity *= 0.95; // Fade glow
        }
        break;

      case 'flame':
        // Flame particles flicker and rise
        this.vy -= 0.12;
        this.vx += (Math.random() - 0.5) * 0.4; // Flicker
        this.radius += (Math.random() - 0.5) * 0.3; // Size variation
        this.radius = Math.max(2, this.radius);
        break;

      case 'frost':
        // Frost particles slowly drift down
        this.vy += 0.02; // Gentle fall
        this.vx += (Math.random() - 0.5) * 0.1;
        if (this.angle !== undefined) {
          this.angle += 0.05; // Rotate
        }
        break;

      case 'swirl':
        // Swirl particles in spiral
        if (this.angle !== undefined && this.angularVelocity) {
          this.angle += this.angularVelocity;
          const radius = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          this.vx = Math.cos(this.angle) * radius * 0.98;
          this.vy = Math.sin(this.angle) * radius * 0.98;
        }
        break;

      case 'dissolve-cube':
        // Dissolving cube particles
        this.vy += 0.05;
        this.alpha *= 0.98; // Fade faster
        if (this.scale) {
          this.scale *= 0.97; // Shrink
        }
        break;

      case 'electron':
        // Electrons flow in paths
        // Path handled externally, just apply drift
        this.vx *= 0.99;
        this.vy *= 0.99;
        if (this.glowIntensity) {
          this.glowIntensity = 0.5 + Math.sin(Date.now() * 0.01) * 0.3; // Pulse
        }
        break;
    }

    // Update lifetime and alpha
    this.lifetime -= deltaTime;
    this.alpha = Math.max(0, this.lifetime / this.maxLifetime);
  }

  isDead(): boolean {
    return this.lifetime <= 0 || this.alpha <= 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.globalAlpha = this.alpha;

    switch (this.type) {
      case 'smoke':
        // Draw smoke as gradient circle
        const smokeGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        smokeGradient.addColorStop(0, this.color);
        smokeGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = smokeGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'bubble':
      case 'gas-bubble':
        // Draw bubble with highlight
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'spark':
        // Draw spark with glow
        if (this.glowIntensity) {
          ctx.shadowBlur = this.glowIntensity * 10;
          ctx.shadowColor = this.color;
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Star shape for extra sparkle
        if (this.glowIntensity && this.glowIntensity > 0.5) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.x - this.radius * 1.5, this.y);
          ctx.lineTo(this.x + this.radius * 1.5, this.y);
          ctx.moveTo(this.x, this.y - this.radius * 1.5);
          ctx.lineTo(this.x, this.y + this.radius * 1.5);
          ctx.stroke();
        }
        break;

      case 'flame':
        // Draw flame particle
        const flameGradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        flameGradient.addColorStop(0, '#ffff66');
        flameGradient.addColorStop(0.5, this.color);
        flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'frost':
        // Draw frost crystal
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.angle) ctx.rotate(this.angle);
        
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        
        // Six-pointed crystal
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * this.radius;
          const y = Math.sin(angle) * this.radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();
        break;

      case 'swirl':
        // Draw swirl particle with trail
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add trail effect
        if (this.vx || this.vy) {
          ctx.strokeStyle = this.color;
          ctx.lineWidth = this.radius * 0.5;
          ctx.globalAlpha = this.alpha * 0.3;
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x - this.vx * 3, this.y - this.vy * 3);
          ctx.stroke();
        }
        break;

      case 'dissolve-cube':
        // Draw dissolving cube
        const size = this.radius * (this.scale || 1);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - size / 2, this.y - size / 2, size, size);
        
        // Inner fade
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * 0.3;
        ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        break;

      case 'electron':
        // Draw electron with pulsing glow
        const glowSize = this.radius * (1 + (this.glowIntensity || 0) * 0.5);
        
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
        break;

      default:
        // Default circle rendering
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        break;
    }

    ctx.restore();
  }
}

/**
 * Particle Emitter - manages creation and update of particles
 */
export class ParticleEmitter {
  particles: Particle[] = [];
  private bounds: { width: number; height: number };

  constructor(width: number, height: number) {
    this.bounds = { width, height };
  }

  /**
   * Emit bubble particles
   */
  emitBubbles(x: number, y: number, count: number = 3): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 30,
        y: y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 0.5,
        radius: 3 + Math.random() * 4,
        color: 'rgba(255, 255, 255, 0.7)',
        alpha: 0.8,
        lifetime: 120 + Math.random() * 60,
        type: 'bubble'
      }));
    }
  }

  /**
   * Emit precipitate particles
   */
  emitPrecipitate(x: number, y: number, color: string, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 50,
        y: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0,
        radius: 2 + Math.random() * 3,
        color: color,
        alpha: 1,
        lifetime: 200 + Math.random() * 100,
        type: 'precipitate'
      }));
    }
  }

  /**
   * Emit smoke particles
   */
  emitSmoke(x: number, y: number, count: number = 2): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 20,
        y: y,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -0.3 - Math.random() * 0.2,
        radius: 8 + Math.random() * 6,
        color: 'rgba(200, 200, 200, 0.5)',
        alpha: 0.6,
        lifetime: 100 + Math.random() * 50,
        type: 'smoke'
      }));
    }
  }

  /**
   * Create explosion effect
   */
  explode(x: number, y: number): void {
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 3 + Math.random() * 4;
      
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 4,
        color: `hsl(${Math.random() * 60 + 10}, 100%, ${50 + Math.random() * 30}%)`,
        alpha: 1,
        lifetime: 60 + Math.random() * 40,
        type: 'explosion'
      }));
    }
  }

  /**
   * Update all particles
   */
  update(): void {
    this.particles = this.particles.filter(particle => {
      particle.update();
      
      // Remove particles outside bounds or dead
      if (particle.isDead()) return false;
      if (particle.y < -50 || particle.y > this.bounds.height + 50) return false;
      if (particle.x < -50 || particle.x > this.bounds.width + 50) return false;
      
      return true;
    });
  }

  /**
   * Draw all particles
   */
  draw(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => particle.draw(ctx));
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Emit spark particles
   */
  emitSparks(x: number, y: number, color: string, count: number = 10): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      this.particles.push(new Particle({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1 + Math.random() * 2,
        color,
        alpha: 1,
        lifetime: 30 + Math.random() * 30,
        type: 'spark',
        glowIntensity: 0.8 + Math.random() * 0.2
      }));
    }
  }

  /**
   * Emit flame particles
   */
  emitFlame(x: number, y: number, colors: string[], count: number = 5): void {
    for (let i = 0; i < count; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -1 - Math.random() * 1.5,
        radius: 4 + Math.random() * 6,
        color,
        alpha: 0.8,
        lifetime: 40 + Math.random() * 40,
        type: 'flame'
      }));
    }
  }

  /**
   * Emit frost particles
   */
  emitFrost(x: number, y: number, color: string, count: number = 5): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle({
        x: x + (Math.random() - 0.5) * 100,
        y: y + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 0.2,
        vy: 0.2 + Math.random() * 0.3,
        radius: 3 + Math.random() * 4,
        color,
        alpha: 0, // Fade in
        lifetime: 100 + Math.random() * 100,
        type: 'frost',
        angle: Math.random() * Math.PI * 2
      }));
    }
  }

  /**
   * Emit swirl particles
   */
  emitSwirl(x: number, y: number, colors: string[], count: number = 10): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 40;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      this.particles.push(new Particle({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius,
        vx: Math.cos(angle) * radius, // Store initial position relative to center
        vy: Math.sin(angle) * radius,
        radius: 2 + Math.random() * 3,
        color,
        alpha: 0.8,
        lifetime: 100 + Math.random() * 50,
        type: 'swirl',
        angle: angle,
        angularVelocity: 0.05 + Math.random() * 0.05
      }));
    }
  }

  /**
   * Emit dissolving cube particles
   */
  emitDissolveCube(x: number, y: number, color: string, size: number): void {
    this.particles.push(new Particle({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: size,
      color,
      alpha: 1,
      lifetime: 60 + Math.random() * 30,
      type: 'dissolve-cube',
      scale: 1
    }));
  }

  /**
   * Emit electron particles
   */
  emitElectrons(startX: number, startY: number, endX: number, endY: number, color: string, count: number = 1): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(endY - startY, endX - startX);
      const dist = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
      const speed = 2 + Math.random() * 2;
      
      this.particles.push(new Particle({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2,
        color,
        alpha: 1,
        lifetime: dist / speed,
        type: 'electron',
        glowIntensity: 1
      }));
    }
  }

  /**
   * Get particle count
   */
  getCount(): number {
    return this.particles.length;
  }
}
