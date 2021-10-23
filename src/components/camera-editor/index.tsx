import { useEffect } from "react";
import useCamera from "../../hooks/use-camera";

const isUndefined = (value: any) => typeof value === "undefined";

type CameraEditorProps = {
  lookAtParams?: [x?: number, y?: number, z?: number];
  position?: [x?: number, y?: number, z?: number];
};

function CameraEditor({
  lookAtParams = [undefined, undefined, undefined],
  position = [undefined, undefined, undefined]
}: CameraEditorProps) {
  const camera = useCamera();

  const [lookAtX, lookAtY, lookAtZ] = lookAtParams;

  useEffect(() => {
    if (isUndefined(lookAtX) || isUndefined(lookAtY) || isUndefined(lookAtZ)) {
      return;
    }

    // @ts-ignore-next-line
    camera.lookAt(lookAtX, lookAtY, lookAtZ);
  }, [camera, lookAtX, lookAtY, lookAtZ]);

  const [positionX, positionY, positionZ] = position;

  useEffect(() => {
    if (
      isUndefined(positionX) ||
      isUndefined(positionY) ||
      isUndefined(positionZ)
    ) {
      return;
    }

    // @ts-ignore-next-line
    camera.position.set(positionX, positionY, positionZ);
  }, [camera, positionX, positionY, positionZ]);

  return null;
}

export default CameraEditor;
