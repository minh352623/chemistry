'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import Liquid3D from './Liquid3D';
import ParticleSystem3D from './ParticleSystem3D';

export default function Beaker3D() {
  const beakerRef = useRef<THREE.Group>(null);

  // Glass material settings
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95, // Glass-like transparency
    thickness: 0.5, // Refraction
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });

  return (
    <group ref={beakerRef}>
      {/* Beaker Body */}
      {/* Outer shell - slightly larger */}
      <Cylinder args={[1.6, 1.6, 3.5, 32, 1, true]} position={[0, 1.75, 0]}>
        <primitive object={glassMaterial} attach="material" />
      </Cylinder>
      
      {/* Bottom */}
      <Cylinder args={[1.6, 1.6, 0.1, 32]} position={[0, 0.05, 0]}>
        <primitive object={glassMaterial} attach="material" />
      </Cylinder>
      
      {/* Rim */}
      <Cylinder args={[1.65, 1.65, 0.1, 32]} position={[0, 3.5, 0]}>
        <primitive object={glassMaterial} attach="material" />
      </Cylinder>

      {/* Volume Markers (Rings) */}
      {[1, 2, 3].map((level) => (
        <Cylinder 
          key={level} 
          args={[1.61, 1.61, 0.02, 32]} 
          position={[0, level, 0]}
        >
          <meshBasicMaterial color="#aaaaaa" transparent opacity={0.5} />
        </Cylinder>
      ))}

      {/* Liquid Content */}
      <Liquid3D />
      
      {/* Particle System */}
      <ParticleSystem3D />
    </group>
  );
}
