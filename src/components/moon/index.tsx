import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import map from "./material-map.jpg";
import normalMap from "./material-normal-map-2.jpg";

function Moon(props: JSX.IntrinsicElements["mesh"]) {
  const [rotationY, setRotationY] = useState(0);
  const textureProps = useTexture({ map, normalMap });

  useFrame((state, delta) => {
    setRotationY((y) => y + 0.005);
  });

  return (
    <mesh {...props} rotation={[0, rotationY, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

export { Moon };
