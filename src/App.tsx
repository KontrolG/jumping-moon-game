import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./components/moon";
import { Plane } from "./components/plane";
import { ComponentPropsWithoutRef, Suspense, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import { Physics, Debug } from "@react-three/cannon";
import { Box } from "./components/box";

function App() {
  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <axesHelper />
          <gridHelper args={[200, 100]} />
          <ambientLight color="black" />
          <Stars />
          <PointLight castShadow position={[5, 15, 0]} rotation={[0, 0, 0]} />
          <OrbitControls enableZoom />
          <Physics
            iterations={20}
            tolerance={0.0001}
            defaultContactMaterial={{
              friction: 0.9,
              restitution: 0.7,
              contactEquationStiffness: 1e7,
              contactEquationRelaxation: 1,
              frictionEquationStiffness: 1e7,
              frictionEquationRelaxation: 2
            }}
            gravity={[0, -40, 0]}
            allowSleep={false}
          >
            <Debug color="black" scale={1.1}>
              <Box position={[0, 7, 0]} />
              <Moon position={[0, 15, 0]} />
              <Plane position={[15, 0, 0]} />
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
