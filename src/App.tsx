import "./App.css";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three"; // Added missing import
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
import { Projectile } from "./components/projectile";
import {
  GRAVITY,
  INITIAL_MOON_POSITION,
  MOON_RADIUS,
  POINTS_TO_WIN,
  PROJECTILE_MAX_INTERVAL,
  PROJECTILE_MIN_INTERVAL,
  PROJECTILE_SPAWN_HEIGHT_OFFSET,
  PROJECTILE_SPAWN_RADIUS,
  PROJECTILE_SPEED,
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
  const [moonPosition, setMoonPosition] = useState<Triplet>(INITIAL_MOON_POSITION);

  interface ActiveProjectile {
    id: string;
    position: Triplet;
    velocity: Triplet;
  }
  const [activeProjectiles, setActiveProjectiles] = useState<ActiveProjectile[]>([]);

  const removeProjectile = useCallback((idToRemove: string) => {
    setActiveProjectiles((prev) => prev.filter(p => p.id !== idToRemove));
  }, []);

  // Without useCallback, the camera moves glitchy.
  const updateCameraToFollowObject = useCallback(
    (position: Triplet) => {
      setMoonPosition(position); // Keep track of moon's position for projectiles
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
    setCameraPosition(initialCameraPosition);
    setCameraLookAt(initialCameraLookAt);
    setGameStatus(initialGameStatus);
    setPoints(0);
    setActiveProjectiles([]); // Clear projectiles on restart
    setMoonPosition(INITIAL_MOON_POSITION); // Reset moon position tracker
  }

  useEffect(() => {
    if (points < POINTS_TO_WIN) return;
    winGame();
  }, [points]);

  // Projectile Spawning Logic
  useEffect(() => {
    if (gameStatus !== "play") {
      return;
    }

    const spawnProjectile = () => {
      const [playerX, playerY, playerZ] = moonPosition;

      // Random angle around the player
      const angle = Math.random() * Math.PI * 2;
      const spawnX = playerX + PROJECTILE_SPAWN_RADIUS * Math.cos(angle);
      const spawnZ = playerZ + PROJECTILE_SPAWN_RADIUS * Math.sin(angle);
      const spawnY = playerY + PROJECTILE_SPAWN_HEIGHT_OFFSET + Math.random() * 5; // Add some randomness to height

      const projectileStartPosition: Triplet = [spawnX, spawnY, spawnZ];

      // Calculate direction towards player
      const direction = new THREE.Vector3(playerX - spawnX, playerY - spawnY, playerZ - spawnZ).normalize();
      const velocity: Triplet = [
        direction.x * PROJECTILE_SPEED,
        direction.y * PROJECTILE_SPEED,
        direction.z * PROJECTILE_SPEED,
      ];

      setActiveProjectiles((prev) => [
        ...prev,
        { id: `proj-${Date.now()}-${Math.random()}`, position: projectileStartPosition, velocity },
      ]);
    };

    let timeoutId: NodeJS.Timeout;
    const scheduleNextSpawn = () => {
      const interval = PROJECTILE_MIN_INTERVAL + Math.random() * (PROJECTILE_MAX_INTERVAL - PROJECTILE_MIN_INTERVAL);
      timeoutId = setTimeout(() => {
        spawnProjectile();
        if (gameStatus === "play") { // Check again in case game status changed during timeout
          scheduleNextSpawn();
        }
      }, interval);
    };

    if (gameStatus === "play") {
      scheduleNextSpawn(); // Start the spawning cycle
    }

    return () => clearTimeout(timeoutId); // Cleanup on unmount or if game status changes
  }, [gameStatus, moonPosition]);


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
              onHitByProjectile={() => {
                if (gameStatus === "play") { // Only lose if currently playing
                  loseGame();
                }
              }}
            />
            <PlaneTrigger onCollide={loseGame} position={[0, -50, 0]} />

            {activeProjectiles.map((projectile) => (
              <Projectile
                key={projectile.id}
                id={projectile.id} // Pass ID for removal requests
                position={projectile.position}
                velocity={projectile.velocity}
                onCollide={(collidingBodyType) => {
                  // Remove the projectile if it hits anything.
                  // We might want to avoid removing it if it hits another projectile in the future,
                  // but for now, any collision removes it.
                  removeProjectile(projectile.id);
                }}
                requestRemove={removeProjectile} // Pass the removal function
              />
            ))}
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
