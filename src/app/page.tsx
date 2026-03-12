'use client';

import dynamic from 'next/dynamic';
import { ScrollOrchestratorProvider, useZScroll } from '@/components/ScrollOrchestrator';
import HeroPhase from '@/components/phases/HeroPhase';
import ServicesJourney from '@/components/phases/ServicesJourney';
import ProcessFramework from '@/components/phases/ProcessFramework';
import ContactClimax from '@/components/phases/ContactClimax';

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

function Experience() {
  const { smoothZProgress } = useZScroll();

  return (
    <>
      <Scene zProgress={smoothZProgress} />
      
      {/* HTML Overlay Layers */}
      <HeroPhase zProgress={smoothZProgress} />
      <ServicesJourney zProgress={smoothZProgress} />
      <ProcessFramework zProgress={smoothZProgress} />
      <ContactClimax zProgress={smoothZProgress} />
    </>
  );
}

export default function Home() {
  return (
    <main className="relative w-full h-full overflow-hidden bg-transparent">
      <ScrollOrchestratorProvider>
        <Experience />
      </ScrollOrchestratorProvider>
    </main>
  );
}
