import { ComponentPropsWithoutRef } from "react";

export function PointLight(props: ComponentPropsWithoutRef<"pointLight">) {
  return (
    <>
      <pointLight {...props}>{/* <arrowHelper /> */}</pointLight>
      {/* {pointerLight ? <pointLightHelper args={[pointerLight, 1]} /> : null} */}
    </>
  );
}
