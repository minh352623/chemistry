'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import Beaker3D from './Beaker3D';

export default function Scene3D() {
  return (
    <div className="w-full h-full relative bg-gradient-to-b from-gray-50 to-gray-200">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={45} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Environment for reflections */}
        <Environment preset="city" />

        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Beaker3D />
            <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          </group>
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2}
          minDistance={4}
          maxDistance={10}
        />
      </Canvas>
      
      {/* Loading Overlay if needed */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <span className="text-xs text-gray-400 font-mono">3D Mode Active</span>
      </div>
    </div>
  );
}
