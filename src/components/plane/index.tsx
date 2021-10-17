import { PlaneProps, usePlane } from "@react-three/cannon";
import { DoubleSide } from "three";

function Plane(props: PlaneProps) {
  const [ref] = usePlane(() => ({
    type: "Static",
    mass: 1000,
    rotation: [-Math.PI / 2, 0, 0],
    args: [100, 100],
    onCollide: (e: any) => {
      console.log(e);
    },
    ...props
  }));

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry args={[100, 100]} />
      <meshStandardMaterial color="#ccc" side={DoubleSide} />
    </mesh>
  );
}

export { Plane };
