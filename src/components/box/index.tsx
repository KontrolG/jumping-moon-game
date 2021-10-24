import { useRef, useState } from "react";
import { BoxProps as BaseBoxProps, useBox } from "@react-three/cannon";

interface BoxProps extends BaseBoxProps {
  onCollideForFirstTime?: () => void;
}

function Box({ onCollideForFirstTime, ...props }: BoxProps) {
  const [hasCollided, setHasCollided] = useState(false);
  // Using ref because onCollide function is memoized after creation.
  const hasCollidedRef = useRef(hasCollided);
  hasCollidedRef.current = hasCollided;

  const [ref] = useBox(() => ({
    type: "Static",
    mass: 10,
    rotation: [-Math.PI / 2, 0, 0],
    args: [10, 10, 0.5],
    onCollide() {
      if (hasCollidedRef.current) return;
      setHasCollided(true);
      onCollideForFirstTime?.();
    },
    ...props
  }));

  return (
    <mesh ref={ref} scale={1}>
      <boxGeometry args={[10, 10, 0.5]} />
      <meshStandardMaterial color={hasCollided ? "#aaa" : "orange"} />
    </mesh>
  );
}

export { Box };
