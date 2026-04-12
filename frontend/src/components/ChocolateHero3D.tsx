import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment, ContactShadows } from '@react-three/drei';
import styles from './ChocolateHero3D.module.css';

function ChocolateSphere() {
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh castShadow>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshStandardMaterial
          color="#4a2511"
          metalness={0.3}
          roughness={0.4}
          envMapIntensity={1.5}
        />
      </mesh>
      {/* Gold accent ring */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#d4af37"
          metalness={0.9}
          roughness={0.1}
          emissive="#d4af37"
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

export const ChocolateHero3D = () => {
  return (
    <div className={styles.heroContainer}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#d4af37" />
        
        <ChocolateSphere />
        <ContactShadows
          position={[0, -2, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />
        <Environment preset="sunset" />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};
