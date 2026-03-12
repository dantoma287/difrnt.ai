'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { MotionValue } from 'framer-motion';
import Lighting from './Lighting';
import Orb from './Orb';

export default function Scene({ zProgress }: { zProgress?: MotionValue<number> }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <Lighting />
          {zProgress && <Orb zProgress={zProgress} />}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
