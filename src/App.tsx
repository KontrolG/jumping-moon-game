import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./components/moon";
import { PlaneTrigger } from "./components/plane-trigger";
import { ComponentPropsWithoutRef, Suspense, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, Debug } from "@react-three/cannon";
import { Box } from "./components/box";
import { randFloatSpread } from "three/src/math/MathUtils";

function App() {
  return (
    <div className="App">
      <Canvas
        camera={{ fov: 75, near: 0.1, far: 1000, position: [20, 15, 150] }}
      >
        <Suspense fallback={null}>
          <axesHelper />
          <gridHelper args={[200, 100]} />
          <ambientLight color="black" />
          <Stars radius={300} />
          <PointLight castShadow position={[5, 15, 0]} rotation={[0, 0, 0]} />
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
            gravity={[0, -40, 0]}
            allowSleep={false}
          >
            <Debug color="black" scale={1.1}>
              {Array(10)
                .fill(null)
                .map((_, index) => {
                  return (
                    <Box
                      key={index}
                      position={[
                        20 * index + 1,
                        Math.abs(randFloatSpread(20)),
                        randFloatSpread(20)
                      ]}
                    />
                  );
                })}
              <Box position={[0, 15, 0]} />
              <Moon position={[0, 20, 0]} />
              <PlaneTrigger position={[0, -50, 0]} />
            </Debug>
          </Physics>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;

function PointLight(props: ComponentPropsWithoutRef<"pointLight">) {
  const [pointerLight, setPointerLight] = useState(null);

  return (
    <>
      <pointLight {...props} ref={setPointerLight}>
        <arrowHelper />
      </pointLight>
      {pointerLight ? <pointLightHelper args={[pointerLight, 1]} /> : null}
    </>
  );
}
