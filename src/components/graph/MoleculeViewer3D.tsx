'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface AtomProps {
  position: [number, number, number];
  element: string;
}

const ELEMENT_COLORS: Record<string, string> = {
  H: '#ffffff', // White
  C: '#333333', // Black/Dark Grey
  O: '#ff0000', // Red
  N: '#0000ff', // Blue
  Cl: '#00ff00', // Green
  Na: '#800080', // Purple
  S: '#ffff00', // Yellow
  Cu: '#b87333', // Copper
  Fe: '#a19d94', // Iron
  Zn: '#7b858f', // Zinc
  Mg: '#c0c0c0', // Magnesium
  Al: '#a9a9a9', // Aluminum
};

const ELEMENT_SIZES: Record<string, number> = {
  H: 0.3,
  C: 0.5,
  O: 0.45,
  N: 0.45,
  Cl: 0.6,
  Na: 0.7,
  S: 0.6,
  default: 0.5
};

function Atom({ position, element }: AtomProps) {
  const color = ELEMENT_COLORS[element] || '#ff00ff'; // Magenta for unknown
  const size = ELEMENT_SIZES[element] || ELEMENT_SIZES.default;

  return (
    <Sphere position={position} args={[size, 32, 32]}>
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </Sphere>
  );
}

function Bond({ start, end }: { start: [number, number, number], end: [number, number, number] }) {
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = new THREE.Vector3().subVectors(endVec, startVec);
  const length = direction.length();
  
  // Calculate center position
  const position = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
  
  // Calculate rotation to align cylinder with bond direction
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  const rotation = new THREE.Euler().setFromQuaternion(quaternion);

  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[0.1, 0.1, length, 8]} />
      <meshStandardMaterial color="#cccccc" />
    </mesh>
  );
}

function Molecule({ formula }: { formula: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5; // Auto-rotate
    }
  });

  // Simple hardcoded structures for demo purposes
  // In a real app, this would parse PDB/CIF files or use an API
  const getStructure = (formula: string) => {
    switch (formula) {
      case 'H2O':
        return (
          <group>
            <Atom position={[0, 0, 0]} element="O" />
            <Atom position={[0.8, 0.6, 0]} element="H" />
            <Atom position={[-0.8, 0.6, 0]} element="H" />
            <Bond start={[0, 0, 0]} end={[0.8, 0.6, 0]} />
            <Bond start={[0, 0, 0]} end={[-0.8, 0.6, 0]} />
          </group>
        );
      case 'HCl':
        return (
          <group>
            <Atom position={[0, 0, 0]} element="Cl" />
            <Atom position={[1.2, 0, 0]} element="H" />
            <Bond start={[0, 0, 0]} end={[1.2, 0, 0]} />
          </group>
        );
      case 'NaCl':
        // Crystal lattice fragment
        return (
          <group>
             <Atom position={[0, 0, 0]} element="Na" />
             <Atom position={[1.2, 0, 0]} element="Cl" />
             <Bond start={[0, 0, 0]} end={[1.2, 0, 0]} />
          </group>
        );
      case 'CO2':
         return (
          <group>
            <Atom position={[0, 0, 0]} element="C" />
            <Atom position={[1.2, 0, 0]} element="O" />
            <Atom position={[-1.2, 0, 0]} element="O" />
            <Bond start={[0, 0, 0]} end={[1.2, 0, 0]} />
            <Bond start={[0, 0, 0]} end={[-1.2, 0, 0]} />
          </group>
         );
      default:
        // Generic single atom representation if unknown
        return <Atom position={[0, 0, 0]} element={formula.replace(/[0-9]/g, '')} />;
    }
  };

  return (
    <group ref={groupRef}>
      {getStructure(formula)}
    </group>
  );
}

export default function MoleculeViewer3D({ formula }: { formula: string }) {
  return (
    <div className="w-full h-64 bg-slate-900 rounded-lg overflow-hidden relative">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Molecule formula={formula} />
        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
      <div className="absolute bottom-2 right-2 text-xs text-white/50 pointer-events-none">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}
