import "./App.css";
import { Canvas } from "@react-three/fiber";
import { Moon } from "./components/moon";
import { ComponentPropsWithoutRef, Suspense, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";

function App() {
  return (
    <div className="App">
      <Canvas camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <axesHelper />
          <gridHelper args={[200, 100]} />
          <ambientLight color="black" />
          <Stars />
          <PointLight position={[5, 0, 0]} rotation={[0, 4.75, 0]} />
          <OrbitControls enableZoom />
          <Moon position={[-5, 0, 0]} />
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
