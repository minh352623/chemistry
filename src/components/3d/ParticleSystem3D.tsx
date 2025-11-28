'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useLabStore } from '@/store/labStore';

// Particle types
type ParticleType = 'bubble' | 'precipitate' | 'gas' | 'spark' | 'smoke' | 'frost';

interface ParticleData {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
  type: ParticleType;
  color: THREE.Color;
}

const MAX_PARTICLES = 2000;

export default function ParticleSystem3D() {
  const bubblesRef = useRef<THREE.InstancedMesh>(null);
  const precipitatesRef = useRef<THREE.InstancedMesh>(null);
  const sparksRef = useRef<THREE.InstancedMesh>(null);
  const smokeRef = useRef<THREE.InstancedMesh>(null);
  const frostRef = useRef<THREE.InstancedMesh>(null);
  
  const beakerState = useLabStore(state => state.beakerState);
  const currentReaction = useLabStore(state => state.currentReaction);
  
  // Store particle data
  const particles = useRef<ParticleData[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Animation state
  const animationTime = useRef(0);

  useEffect(() => {
    particles.current = [];
    animationTime.current = 0;
  }, [currentReaction?.id]);

  useFrame((state, delta) => {
    const activeEffects = beakerState.activeEffects;
    const liquidHeight = (beakerState.volume / 100) * 3.0;
    
    // Handle reaction animation sequencing
    if (currentReaction?.animationConfig) {
      animationTime.current += delta * 1000; // ms
      const config = currentReaction.animationConfig;
      
      // Flash effect (Sparks)
      if (config.flash && animationTime.current < config.flash.duration) {
        if (Math.random() < 0.5) spawnParticle('spark', liquidHeight);
      }
      
      // Smoke sequence
      if (config.gas?.steamEffect && animationTime.current > 500) {
        if (Math.random() < 0.1) spawnParticle('smoke', liquidHeight);
      }
    }

    // 1. Spawn new particles
    if (particles.current.length < MAX_PARTICLES) {
      // Bubbles
      if (activeEffects.bubbles && activeEffects.bubbles !== 'none') {
        const intensity = activeEffects.bubbles === 'large' ? 0.4 : 0.1;
        if (Math.random() < intensity) spawnParticle('bubble', liquidHeight);
      }
      
      // Gas
      if (activeEffects.gas && activeEffects.gas.intensity > 0) {
         if (Math.random() < activeEffects.gas.intensity * 0.05) spawnParticle('gas', liquidHeight);
      }
      
      // Precipitate
      if (activeEffects.precipitate) {
        if (Math.random() < 0.15) {
          spawnParticle('precipitate', liquidHeight, activeEffects.precipitate.color);
        }
      }
      
      // Sparks/Explosion
      if (activeEffects.explosion || (activeEffects.temperatureChange && activeEffects.temperatureChange > 20)) {
        if (Math.random() < 0.3) spawnParticle('spark', liquidHeight);
      }
      
      // Smoke
      if (activeEffects.smoke) {
        if (Math.random() < 0.05) spawnParticle('smoke', liquidHeight);
      }
      
      // Frost
      if (activeEffects.temperatureChange && activeEffects.temperatureChange < -5) {
        if (Math.random() < 0.1) spawnParticle('frost', liquidHeight);
      }
    }

    // 2. Update particles
    let bubbleCount = 0;
    let precipitateCount = 0;
    let sparkCount = 0;
    let smokeCount = 0;
    let frostCount = 0;

    for (let i = particles.current.length - 1; i >= 0; i--) {
      const p = particles.current[i];
      p.life -= delta;
      
      if (p.life <= 0) {
        particles.current.splice(i, 1);
        continue;
      }

      // Physics
      p.position.add(p.velocity.clone().multiplyScalar(delta));
      
      // Behavior
      if (p.type === 'bubble' || p.type === 'gas') {
        p.velocity.y += delta * 0.8;
        p.position.x += Math.sin(state.clock.elapsedTime * 5 + i) * 0.01;
        if (p.position.y > liquidHeight + 0.1) p.life = 0; // Pop
      } else if (p.type === 'precipitate') {
        p.velocity.y -= delta * 0.3;
        if (p.position.y < 0.1) {
          p.position.y = 0.1;
          p.velocity.set(0, 0, 0);
        }
      } else if (p.type === 'spark') {
        p.velocity.y -= delta * 1.5; // Gravity
      } else if (p.type === 'smoke') {
        p.velocity.y += delta * 0.2; // Rise slowly
        p.scale += delta * 0.1; // Expand
      } else if (p.type === 'frost') {
        p.velocity.y -= delta * 0.1; // Fall slowly
        if (p.position.y < 0.1) {
          p.position.y = 0.1;
          p.velocity.set(0, 0, 0);
        }
      }

      // Render to appropriate mesh
      dummy.position.copy(p.position);
      
      let scale = p.scale;
      if (p.life < 0.5) scale *= p.life * 2;
      
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      if ((p.type === 'bubble' || p.type === 'gas') && bubblesRef.current) {
        bubblesRef.current.setMatrixAt(bubbleCount, dummy.matrix);
        bubblesRef.current.setColorAt(bubbleCount, p.color);
        bubbleCount++;
      } else if (p.type === 'precipitate' && precipitatesRef.current) {
        precipitatesRef.current.setMatrixAt(precipitateCount, dummy.matrix);
        precipitatesRef.current.setColorAt(precipitateCount, p.color);
        precipitateCount++;
      } else if (p.type === 'spark' && sparksRef.current) {
        sparksRef.current.setMatrixAt(sparkCount, dummy.matrix);
        sparksRef.current.setColorAt(sparkCount, p.color);
        sparkCount++;
      } else if (p.type === 'smoke' && smokeRef.current) {
        smokeRef.current.setMatrixAt(smokeCount, dummy.matrix);
        smokeRef.current.setColorAt(smokeCount, p.color);
        smokeCount++;
      } else if (p.type === 'frost' && frostRef.current) {
        frostRef.current.setMatrixAt(frostCount, dummy.matrix);
        frostRef.current.setColorAt(frostCount, p.color);
        frostCount++;
      }
    }

    // Update counts and flags
    if (bubblesRef.current) {
      bubblesRef.current.count = bubbleCount;
      bubblesRef.current.instanceMatrix.needsUpdate = true;
      if (bubblesRef.current.instanceColor) bubblesRef.current.instanceColor.needsUpdate = true;
    }
    if (precipitatesRef.current) {
      precipitatesRef.current.count = precipitateCount;
      precipitatesRef.current.instanceMatrix.needsUpdate = true;
      if (precipitatesRef.current.instanceColor) precipitatesRef.current.instanceColor.needsUpdate = true;
    }
    if (sparksRef.current) {
      sparksRef.current.count = sparkCount;
      sparksRef.current.instanceMatrix.needsUpdate = true;
      if (sparksRef.current.instanceColor) sparksRef.current.instanceColor.needsUpdate = true;
    }
    if (smokeRef.current) {
      smokeRef.current.count = smokeCount;
      smokeRef.current.instanceMatrix.needsUpdate = true;
      if (smokeRef.current.instanceColor) smokeRef.current.instanceColor.needsUpdate = true;
    }
    if (frostRef.current) {
      frostRef.current.count = frostCount;
      frostRef.current.instanceMatrix.needsUpdate = true;
      if (frostRef.current.instanceColor) frostRef.current.instanceColor.needsUpdate = true;
    }
  });

  const spawnParticle = (type: ParticleType, liquidHeight: number, colorOverride?: string) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 1.2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    
    let y = 0, vy = 0, vx = 0, vz = 0;
    let color = new THREE.Color('#ffffff');
    let scale = 0.1;
    let life = 2 + Math.random();

    switch (type) {
      case 'bubble':
        y = Math.random() * liquidHeight;
        vy = 0.5 + Math.random() * 0.5;
        color.set('#ffffff');
        scale = 0.05 + Math.random() * 0.05;
        break;
      case 'gas':
        y = liquidHeight;
        vy = 1.5 + Math.random();
        vx = (Math.random() - 0.5) * 0.5;
        vz = (Math.random() - 0.5) * 0.5;
        color.set('#eeeeee');
        scale = 0.1 + Math.random() * 0.1;
        break;
      case 'precipitate':
        y = Math.random() * liquidHeight;
        vy = -0.2;
        color.set(colorOverride || '#ffffff');
        scale = 0.04 + Math.random() * 0.03;
        life = 8 + Math.random() * 5;
        break;
      case 'spark':
        y = liquidHeight;
        vy = 3 + Math.random() * 3;
        vx = (Math.random() - 0.5) * 3;
        vz = (Math.random() - 0.5) * 3;
        color.set('#ffaa00');
        scale = 0.05;
        life = 0.5 + Math.random() * 0.5;
        break;
      case 'smoke':
        y = liquidHeight;
        vy = 0.5 + Math.random();
        vx = (Math.random() - 0.5) * 0.5;
        vz = (Math.random() - 0.5) * 0.5;
        color.set('#eeeeee');
        scale = 0.2 + Math.random() * 0.2;
        life = 3 + Math.random();
        break;
      case 'frost':
        y = Math.random() * liquidHeight;
        vy = -0.1;
        color.set('#aaddff');
        scale = 0.05 + Math.random() * 0.05;
        life = 5 + Math.random();
        break;
    }

    particles.current.push({
      position: new THREE.Vector3(x, y, z),
      velocity: new THREE.Vector3(vx, vy, vz),
      life, maxLife: life, scale, type, color
    });
  };

  return (
    <group>
      {/* Bubbles - Spheres */}
      <instancedMesh ref={bubblesRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshPhysicalMaterial 
          transparent opacity={0.6} roughness={0.1} metalness={0.1} transmission={0.5} thickness={0.5}
        />
      </instancedMesh>

      {/* Precipitates - Cubes */}
      <instancedMesh ref={precipitatesRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.8} metalness={0.1} />
      </instancedMesh>

      {/* Sparks - Emissive Spheres */}
      <instancedMesh ref={sparksRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshStandardMaterial emissive="#ffaa00" emissiveIntensity={2} toneMapped={false} />
      </instancedMesh>
      {/* Smoke - Soft Spheres */}
      <instancedMesh ref={smokeRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial 
          transparent opacity={0.3} roughness={1} color="#eeeeee" depthWrite={false}
        />
      </instancedMesh>

      {/* Frost - Tetrahedrons */}
      <instancedMesh ref={frostRef} args={[undefined, undefined, MAX_PARTICLES]}>
        <tetrahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          transparent opacity={0.6} color="#aaddff" roughness={0.2}
        />
      </instancedMesh>
    </group>
  );
}
