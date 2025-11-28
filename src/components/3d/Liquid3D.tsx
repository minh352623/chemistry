'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { useLabStore } from '@/store/labStore';

export default function Liquid3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  
  const beakerState = useLabStore(state => state.beakerState);
  
  // Smooth transition values
  const currentHeight = useRef(0);
  const currentColor = useRef(new THREE.Color(beakerState.color));

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    // Target height based on volume (0-100% -> 0-3.0 units)
    const targetHeight = (beakerState.volume / 100) * 3.0;
    
    // Smoothly interpolate height
    currentHeight.current = THREE.MathUtils.lerp(currentHeight.current, targetHeight, delta * 2);
    
    // Update mesh scale and position
    // Cylinder is centered, so we need to move it up by half its height to sit on bottom
    // Default height is 1, so scale.y is the actual height
    meshRef.current.scale.y = Math.max(0.01, currentHeight.current);
    meshRef.current.position.y = currentHeight.current / 2 + 0.1; // +0.1 for beaker bottom thickness

    // Smoothly interpolate color
    const targetColor = new THREE.Color(beakerState.color);
    currentColor.current.lerp(targetColor, delta * 3);
    materialRef.current.color.copy(currentColor.current);
    
    // Adjust emission based on glow effect
    if (beakerState.activeEffects.glow) {
      materialRef.current.emissive.copy(currentColor.current);
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    } else {
      materialRef.current.emissiveIntensity = THREE.MathUtils.lerp(materialRef.current.emissiveIntensity, 0, delta * 5);
    }
  });

  return (
    <Cylinder 
      ref={meshRef}
      args={[1.5, 1.5, 1, 32]} // Radius matches beaker inner, height 1 (scaled)
      position={[0, 0, 0]}
    >
      <meshPhysicalMaterial 
        ref={materialRef}
        color={beakerState.color}
        transparent
        opacity={0.8}
        roughness={0.2}
        metalness={0.1}
        transmission={0.2}
        thickness={1}
      />
    </Cylinder>
  );
}
