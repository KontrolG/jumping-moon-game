import { SphereProps, useSphere } from "@react-three/cannon";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import map from "./material-map.jpg";
import normalMap from "./material-normal-map-2.jpg";
import useKeyboardInput from "../../hooks/useKeyboardInput";
import useStateMachine from "../../hooks/useStateMachine";

interface MoonProps extends SphereProps {}

function Moon({ ...props }: MoonProps) {
  const camera = useThree((state) => state.camera);
  const cameraRef = useRef(true);
  const isTouchingASurface = useRef(false);
  const [ref, api] = useSphere(() => ({
    mass: 1,
    args: [1],
    onCollide: (event) => {
      isTouchingASurface.current = true;
      console.log("Can jump");
      if (event.body.name === "Plane") {
        cameraRef.current = false;
      }
    },
    onCollideEnd: (e) => {
      isTouchingASurface.current = false;
      console.log("Can't jump");
    },
    ...props
  }));
  const textureProps = useTexture({ map, normalMap });
  const { forward, backward, left, right, space } = useKeyboardInput();
  const velocityRef = useRef([0, 0, 0]);
  const isMoving = forward || backward || left || right || space;

  const { activeState, changeActiveState } = useStateMachine({
    idle: {
      onEnter() {
        api.velocity.set(0, 0, 0);
      },
      onUpdate() {
        if (isMoving) {
          return changeActiveState("moving");
        }
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
  }, []);

  useEffect(() => {
    api.velocity.subscribe((position) => {
      velocityRef.current = position;
    });
    const unsubscribe = api.position.subscribe((position) => {
      if (!cameraRef.current) return;
      const [x, y, z] = position;
      camera.position.set(x - 15, y + 5, z);
      camera.lookAt(x, y, z);
    });

    return unsubscribe;
  }, []);

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial {...textureProps} />
    </mesh>
  );
}

export { Moon };
