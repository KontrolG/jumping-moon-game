import { useRef, useEffect } from "react"; // Combined useEffect
import { useFrame } from "@react-three/fiber";
import { useCylinder } from "@react-three/cannon";
import * as THREE from "three";

// Removed duplicate imports of useFrame, useCylinder, and THREE

interface ProjectileProps {
  id: string; // Need ID for removal
  position: [number, number, number];
  velocity: [number, number, number];
  onCollide: (collidingBodyType?: string) => void; // Pass type of body it collided with
  requestRemove: (id: string) => void; // Function to request removal from parent
}

const projectileMaterial = new THREE.MeshStandardMaterial({ color: "red" });
const projectileGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 6, 1); // radiusTop, radiusBottom, height, radialSegments, heightSegments
const MAX_PROJECTILE_LIFETIME = 8000; // 8 seconds
const MAX_PROJECTILE_DISTANCE = 150; // Max distance from origin before removal

export function Projectile({ id, position, velocity, onCollide, requestRemove }: ProjectileProps) {
  const [ref, api] = useCylinder(() => ({
    mass: 1,
    position,
    velocity,
    args: [0, 0.5, 1, 6],
    userData: { type: "projectile", id }, // Add id to userData for easier identification on collision
    onCollide: (e) => {
      // Call the passed onCollide, which in App.tsx will handle removal.
      // Pass the type of the body it collided with, if available.
      onCollide(e.body?.userData?.type as string | undefined);
    },
  }));

  // Auto-remove projectile after a certain lifetime
  useEffect(() => {
    const timer = setTimeout(() => {
      requestRemove(id);
    }, MAX_PROJECTILE_LIFETIME);
    return () => clearTimeout(timer);
  }, [id, requestRemove]);

  // Auto-remove projectile if it goes too far
  useFrame(() => {
    if (ref.current) {
      const currentPosition = ref.current.position;
      if (currentPosition.length() > MAX_PROJECTILE_DISTANCE) {
        requestRemove(id);
      }
    }
  });

  return (
    <mesh ref={ref as any} material={projectileMaterial} geometry={projectileGeometry} castShadow>
    </mesh>
  );
}
