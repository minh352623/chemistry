'use client';

import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface AtomProps {
  position: [number, number, number];
  color: string;
  size: number;
}

function Atom({ position, color, size }: AtomProps) {
  return (
    <Sphere args={[size, 32, 32]} position={position}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
    </Sphere>
  );
}

interface BondProps {
  start: [number, number, number];
  end: [number, number, number];
}

function Bond({ start, end }: BondProps) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  
  // Calculate orientation
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  
  // Midpoint
  const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);

  return (
    <Cylinder 
      args={[0.15, 0.15, length, 16]} 
      position={[midPoint.x, midPoint.y, midPoint.z]}
      quaternion={quaternion}
    >
      <meshStandardMaterial color="#94a3b8" />
    </Cylinder>
  );
}

// Simple procedural molecule generator based on formula
// This is a placeholder for real PDB/SDF parsing
const getMoleculeStructure = (formula: string) => {
  // Mock structures for demo
  if (formula.includes('H2O')) {
    return {
      atoms: [
        { pos: [0, 0, 0], color: 'red', size: 0.4 }, // O
        { pos: [0.8, -0.6, 0], color: 'white', size: 0.25 }, // H
        { pos: [-0.8, -0.6, 0], color: 'white', size: 0.25 }, // H
      ],
      bonds: [
        { start: [0, 0, 0], end: [0.8, -0.6, 0] },
        { start: [0, 0, 0], end: [-0.8, -0.6, 0] },
      ]
    };
  }
  if (formula.includes('NaCl')) {
    return {
      atoms: [
        { pos: [-0.6, 0, 0], color: '#a3e635', size: 0.5 }, // Na
        { pos: [0.6, 0, 0], color: '#22c55e', size: 0.6 }, // Cl
      ],
      bonds: [
        { start: [-0.6, 0, 0], end: [0.6, 0, 0] }
      ]
    };
  }
  if (formula.includes('HCl')) {
    return {
      atoms: [
        { pos: [-0.5, 0, 0], color: 'white', size: 0.25 }, // H
        { pos: [0.5, 0, 0], color: '#22c55e', size: 0.6 }, // Cl
      ],
      bonds: [
        { start: [-0.5, 0, 0], end: [0.5, 0, 0] }
      ]
    };
  }
  
  // Default single atom
  return {
    atoms: [{ pos: [0, 0, 0], color: '#cbd5e1', size: 0.5 }],
    bonds: []
  };
};

function Molecule({ formula }: { formula: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const structure = getMoleculeStructure(formula);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      {structure.atoms.map((atom, i) => (
        <Atom key={i} position={atom.pos as any} color={atom.color} size={atom.size} />
      ))}
      {structure.bonds.map((bond, i) => (
        <Bond key={i} start={bond.start as any} end={bond.end as any} />
      ))}
    </group>
  );
}

export default function MoleculeViewer3D({ formula }: { formula: string }) {
  return (
    <div className="w-full h-48 bg-slate-100 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Molecule formula={formula} />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-mono">
        3D View
      </div>
    </div>
  );
}
