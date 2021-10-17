import { useSphere } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { useEffect, useState } from "react";
import map from "./material-map.jpg";
import normalMap from "./material-normal-map-2.jpg";

function Moon(props: any) {
  const [isMovingForward, setIsMovingFoward] = useState(false);
  const [ref, api] = useSphere(() => ({
    mass: 10,
    ...props
  }));
  const textureProps = useTexture({ map, normalMap });

  useEffect(() => {
    api.velocity.set(isMovingForward ? 5 : 0, 0, 0);
  }, [api.velocity, isMovingForward]);

  return (
    <mesh
      ref={ref}
      onClick={() => setIsMovingFoward((isMovingForward) => !isMovingForward)}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

export { Moon };
