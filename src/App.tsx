import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./components/moon";
import { PlaneTrigger } from "./components/plane-trigger";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Stars } from "@react-three/drei";
import { Physics, Triplet } from "@react-three/cannon";
import { Box } from "./components/box";
import { randFloatSpread } from "three/src/math/MathUtils";
import CameraEditor from "./components/camera-editor";
import { HUD } from "./components/hud";
import { PointLight } from "./components/point-light";
import {
  GRAVITY,
  INITIAL_MOON_POSITION,
  MOON_RADIUS,
  POINTS_TO_WIN
} from "./constants/configurations";
import { Joystick } from "./components/joystick";
import Input from "./types/Input";
import useKeyboardInput from "./hooks/useKeyboardInput";
import { useMediaQuery } from "./hooks/use-media-query";

const getPositionWithCameraOffset = ([x, y, z]: [
  x: number,
  y: number,
  z: number
]) => [x - 15, y + 5, z] as [number, number, number];

type GameStatus = "play" | "lost" | "won";

const initialCameraPosition: [number, number, number] =
  getPositionWithCameraOffset(INITIAL_MOON_POSITION);
const initialCameraLookAt: [number, number, number] = INITIAL_MOON_POSITION;

const initialGameStatus: GameStatus = "play";

function App() {
  const [cameraPosition, setCameraPosition] = useState(initialCameraPosition);
  const [cameraLookAt, setCameraLookAt] = useState(initialCameraLookAt);
  const [gameStatus, setGameStatus] = useState(initialGameStatus);
  const [points, setPoints] = useState(0);
  const hasJoystickEnabled = useMediaQuery("(hover: none)");
  const keyboardInput = useKeyboardInput();
  const [space, setSpace] = useState(false);
  const [joystickInput, setJoystickInput] =
    useState<Omit<Input, "space" | "shift">>();
  const [joystickForce, setJoystickForce] = useState(0);

  // Without useCallback, the camera moves glitchy.
  const updateCameraToFollowObject = useCallback(
    (position: [number, number, number]) => {
      if (gameStatus === "lost") return;
      setCameraPosition(getPositionWithCameraOffset(position));
      setCameraLookAt(position);
    },
    [gameStatus]
  );

  function increasePoints() {
    setPoints((points) => points + 1);
  }

  function loseGame() {
    setGameStatus("lost");
  }

  function winGame() {
    setGameStatus("won");
  }

  function restartGame() {
    // TODO: Improve this.
    window.location.reload();
  }

  useEffect(() => {
    if (points < POINTS_TO_WIN) return;
    winGame();
  }, [points]);

  const [x, y, z] = INITIAL_MOON_POSITION;
  const startBoxPosition: Triplet = [x, y - MOON_RADIUS, z];

  const moonInput = hasJoystickEnabled
    ? { ...joystickInput, space }
    : keyboardInput;
  const moonInputForce = hasJoystickEnabled ? joystickForce : 1;

  function onMoveJoystick(_event: any, { direction, force }: any) {
    if (!direction) {
      setJoystickInput({});
      setJoystickForce(0);
      return;
    }
    setJoystickInput({
      [direction?.x]: true,
      [direction?.y === "up" ? "forward" : "backward"]: true
    });
    setJoystickForce(force);
  }

  return (
    <div className="App">
      <HUD
        gameStatus={gameStatus}
        points={points}
        onRestartGame={restartGame}
      />
      <section className="JoystickContainer">
        <Joystick
          onMove={onMoveJoystick}
          mode="static"
          restOpacity={0.5}
          containerStyle={{
            background: "none",
            width: "30%",
            pointerEvents: "auto"
          }}
          position={{ top: "50%", left: "50%" }}
          size={150}
        />
        <button
          className="JumpButton"
          type="button"
          onTouchStart={() => setSpace(true)}
          onTouchEnd={() => setSpace(false)}
        >
          Jump!
        </button>
      </section>
      <Canvas
        camera={{
          fov: 75,
          near: 0.1,
          far: 1000,
          position: initialCameraPosition
        }}
      >
        <Suspense fallback={null}>
          <ambientLight color="black" />
          <Stars radius={300} />
          <PointLight castShadow position={[0, 30, 0]} rotation={[0, 0, 0]} />
          <PointLight castShadow position={[100, 30, 0]} rotation={[0, 0, 0]} />
          <PointLight castShadow position={[200, 30, 0]} rotation={[0, 0, 0]} />
          <CameraEditor position={cameraPosition} lookAtParams={cameraLookAt} />
          <Physics
            iterations={20}
            tolerance={0.0001}
            defaultContactMaterial={{
              friction: 0.9,
              restitution: 0.7,
              contactEquationRelaxation: 3, // Investigar
              frictionEquationStiffness: 1e7,
              frictionEquationRelaxation: 2
            }}
            gravity={GRAVITY}
            allowSleep={false}
          >
            <Box position={startBoxPosition} />
            {Array(POINTS_TO_WIN)
              .fill(null)
              .map((_, index) => (
                <Box
                  onCollideForFirstTime={increasePoints}
                  key={index}
                  position={[
                    20 * (index + 1),
                    Math.abs(randFloatSpread(20)),
                    randFloatSpread(20)
                  ]}
                />
              ))}
            <Moon
              input={moonInput}
              inputForce={moonInputForce}
              radius={MOON_RADIUS}
              canMove={gameStatus === "play"}
              initialPosition={INITIAL_MOON_POSITION}
              onPositionChange={updateCameraToFollowObject}
            />
            <PlaneTrigger onCollide={loseGame} position={[0, -50, 0]} />
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
