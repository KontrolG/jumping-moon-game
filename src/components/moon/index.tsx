import { SphereProps, Triplet, useSphere } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import map from "./material-map.jpg";
import normalMap from "./material-normal-map-2.jpg";
import useKeyboardInput from "../../hooks/useKeyboardInput";
import useStateMachine from "../../hooks/useStateMachine";

interface MoonProps extends SphereProps {
  radius?: number;
  canMove: boolean;
  onPositionChange?: (position: Triplet) => void;
  initialPosition?: Triplet;
}

function Moon({
  radius = 1,
  canMove,
  initialPosition,
  onPositionChange = () => {},
  ...props
}: MoonProps) {
  const isTouchingASurface = useRef(false);
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [radius],
    onCollide() {
      isTouchingASurface.current = true;
    },
    onCollideEnd() {
      isTouchingASurface.current = false;
    },
    position: initialPosition,
    ...props
  }));
  const textureProps = useTexture({ map, normalMap });
  const { forward, backward, left, right, space } = useKeyboardInput();
  const velocityRef = useRef([0, 0, 0]);
  const isMoving = canMove && (forward || backward || left || right || space);

  const { changeActiveState } = useStateMachine({
    idle: {
      onUpdate() {
        if (isMoving) {
          return changeActiveState("moving");
        }
        // Reduce velocity slowing to 0.
      }
    },
    moving: {
      onUpdate() {
        if (!isMoving) {
          return changeActiveState("idle");
        }
        let x = 0;
        let y = velocityRef.current[1];
        let z = 0;
        if (forward) x += 10;
        if (backward) x -= 10;
        if (left) z -= 10;
        if (right) z += 10;
        if (space && isTouchingASurface.current) {
          y = 50;
          isTouchingASurface.current = false;
        }

        api.velocity.set(x, y, z);
      }
    }
  });

  useEffect(() => {
    changeActiveState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((position) => {
      velocityRef.current = position;
    });
    return unsubscribe;
  }, [api.velocity]);

  useEffect(() => {
    const unsubscribe = api.position.subscribe(onPositionChange);
    return unsubscribe;
  }, [api.position, onPositionChange]);

  useEffect(() => {
    if (canMove) return;
    api.velocity.set(0, 0, 0);
    changeActiveState("idle");
  }, [api.velocity, canMove, changeActiveState]);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

export { Moon };
