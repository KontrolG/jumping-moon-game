import { Mesh } from "three";
import { useRef } from "react";

function Box(props: JSX.IntrinsicElements["mesh"]) {
  const mesh = useRef<Mesh>(null!);

  return (
    <mesh {...props} ref={mesh} scale={1}>
      <arrowHelper />
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export { Box };
