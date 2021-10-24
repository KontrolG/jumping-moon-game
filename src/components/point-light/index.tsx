import { ComponentPropsWithoutRef, useState } from "react";

export function PointLight(props: ComponentPropsWithoutRef<"pointLight">) {
  const [pointerLight, setPointerLight] = useState(null);

  return (
    <>
      <pointLight {...props} ref={setPointerLight}>
        {/* <arrowHelper /> */}
      </pointLight>
      {/* {pointerLight ? <pointLightHelper args={[pointerLight, 1]} /> : null} */}
    </>
  );
}
