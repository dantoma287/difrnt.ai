'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useSpring, MotionValue } from 'framer-motion';

export default function Orb({ zProgress }: { zProgress: MotionValue<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0.2 },
    uNoiseDensity: { value: 1.5 },
    uNoiseStrength: { value: 0.2 },
  }), []);

  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    uniforms.uTime.value = state.clock.elapsedTime;

    mouseX.set(state.pointer.x);
    mouseY.set(state.pointer.y);

    const z = zProgress.get();

    let targetX = 0;
    let targetScaleX = 1;
    let targetScaleY = 1;
    let targetScaleZ = 1;

    if (z > 0.2 && z < 0.65) {
      // Services Journey: shrink and move left
      targetX = -2;
      targetScaleX = 0.8;
      targetScaleY = 0.8;
      targetScaleZ = 0.8;
    } else if (z >= 0.65 && z < 0.9) {
      // Process Framework: back to center
      targetX = 0;
      targetScaleX = 0.8;
      targetScaleY = 0.8;
      targetScaleZ = 0.8;
      uniforms.uNoiseStrength.value = THREE.MathUtils.lerp(uniforms.uNoiseStrength.value, 0.5, 0.05);
    } else if (z >= 0.9) {
      // Contact: morph to flat glass rectangle
      targetX = 0;
      targetScaleX = 4;
      targetScaleY = 2.5;
      targetScaleZ = 0.1;
      uniforms.uNoiseStrength.value = THREE.MathUtils.lerp(uniforms.uNoiseStrength.value, 0.0, 0.1);
    } else {
      // Hero
      targetX = 0;
      targetScaleX = 1;
      targetScaleY = 1;
      targetScaleZ = 1;
      uniforms.uNoiseStrength.value = THREE.MathUtils.lerp(uniforms.uNoiseStrength.value, 0.2, 0.1);
    }

    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScaleX, 0.05);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, 0.05);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScaleZ, 0.05);

    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      mouseY.get() * 0.5,
      0.1
    );
    meshRef.current.rotation.y = THREE.MathUtils.lerp(
      meshRef.current.rotation.y,
      mouseX.get() * 0.5,
      0.1
    );

    meshRef.current.rotation.z += 0.001;
  });

  const onBeforeCompile = (shader: any) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.uniforms.uSpeed = uniforms.uSpeed;
    shader.uniforms.uNoiseDensity = uniforms.uNoiseDensity;
    shader.uniforms.uNoiseStrength = uniforms.uNoiseStrength;

    shader.vertexShader = `
      uniform float uTime;
      uniform float uSpeed;
      uniform float uNoiseDensity;
      uniform float uNoiseStrength;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;

        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        float n_ = 0.142857142857;
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);

        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;

        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      ${shader.vertexShader}
    `.replace(
      '#include <begin_vertex>',
      `
      #include <begin_vertex>
      float noise = snoise(vec3(position * uNoiseDensity + uTime * uSpeed));
      vec3 newPosition = position + normal * noise * uNoiseStrength;
      transformed = newPosition;
      `
    );
  };

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 128]} />
      <meshPhysicalMaterial
        ref={materialRef}
        transmission={1}
        opacity={1}
        transparent={true}
        roughness={0.15}
        ior={1.5}
        thickness={2.5}
        iridescence={1.0}
        iridescenceIOR={1.3}
        color="#ffffff"
        onBeforeCompile={onBeforeCompile}
      />
    </mesh>
  );
}
