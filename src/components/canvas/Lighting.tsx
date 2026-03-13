'use client';

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.5} />

      {/* Soft Pink */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.15}
        penumbra={1}
        color="#FFD1FF"
        intensity={2}
      />

      {/* Soft Blue */}
      <spotLight
        position={[-5, 5, -5]}
        angle={0.15}
        penumbra={1}
        color="#D1EEFF"
        intensity={2}
      />

      {/* Soft Lavender */}
      <spotLight
        position={[0, -5, 5]}
        angle={0.15}
        penumbra={1}
        color="#E5D1FF"
        intensity={2}
      />
    </>
  );
}
