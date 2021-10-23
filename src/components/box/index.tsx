import { Mesh } from "three";
import { useRef } from "react";
import { BoxProps, useBox } from "@react-three/cannon";

function Box(props: BoxProps) {
  const [ref] = useBox(() => ({
    type: "Static",
    mass: 10,
    rotation: [-Math.PI / 2, 0, 0],
    args: [10, 10, 0.5],
    ...props
  }));

  return (
    <mesh ref={ref} scale={1}>
      <arrowHelper />
      <boxGeometry args={[10, 10, 0.5]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export { Box };
