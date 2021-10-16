import { Mesh } from "three";
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

function Sphere(props: JSX.IntrinsicElements["mesh"]) {
  const mesh = useRef<Mesh>(null!);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state, delta) => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive((active) => !active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <arrowHelper />
      <coneGeometry />
      <meshStandardMaterial color={hovered ? "hotpink" : "red"} />
    </mesh>
  );
}

export { Sphere };
