import { PlaneProps, usePlane } from "@react-three/cannon";

function PlaneTrigger(props: PlaneProps) {
  const [ref] = usePlane(() => ({
    isTrigger: true,
    type: "Static",
    rotation: [-Math.PI / 2, 0, 0],
    args: [100, 100],
    ...props
  }));

  return <mesh ref={ref} receiveShadow></mesh>;
}

export { PlaneTrigger };
