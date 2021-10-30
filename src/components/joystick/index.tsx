import { CSSProperties, useEffect, useRef } from "react";
// @ts-ignore-next-line
import BaseJoystick from "react-joystick";

const defaultContainerStyles = {
  width: "100%",
  height: "50vh",
  position: "relative",
  background: "linear-gradient(to right, #E684AE, #79CBCA, #77A1D3)"
};

interface JoyOptions {
  zone?: Element; // active zone
  color?: CSSProperties["color"]; // color of the joystick
  size?: number;
  threshold?: number; // before triggering a directional event
  fadeTime?: number; // transition time
  multitouch?: boolean;
  maxNumberOfNipples?: number; // when multitouch, what is too many?
  dataOnly?: boolean; // no dom element whatsoever
  position?: {
    top?: CSSProperties["top"];
    left?: CSSProperties["left"];
    right?: CSSProperties["right"];
    bottom?: CSSProperties["bottom"];
  }; // preset position for 'static' mode
  mode?: "dynamic" | "static" | "semi"; // 'dynamic', 'static' or 'semi'
  restJoystick?: boolean;
  restOpacity?: number; // opacity when not 'dynamic' and rested
  lockX?: boolean; // only move on the X axis
  lockY?: boolean; // only move on the Y axis
  catchDistance?: number; // distance to recycle previous joystick in
  // 'semi' mode
  shape?: "circle" | "square"; // 'circle' or 'square'
  dynamicPage?: boolean; // Enable if the page has dynamically visible elements
  follow?: boolean; // Makes the joystick follow the thumbstick
}

interface Position {
  x: number;
  y: number;
}

interface Instance {
  [key: string]: any;
}

interface Direction {
  x: "right" | "left";
  y: "up" | "down";
  angle: Direction["x"] | Direction["y"];
}

interface Angle {
  radian: number;
  degree: number;
}

interface Nipple {
  angle: Angle;
  direction: Direction;
  distance: number;
  force: number;
  identifier: number;
  instance: Instance;
  position: Position;
  pressure: number;
}

type ManagerEventHandler = (event: any, nipple: Nipple) => void;

interface Manager {
  on: (type: string, handler: ManagerEventHandler) => void; // handle internal event
  off: (type?: string, handler?: ManagerEventHandler) => void; // un-handle internal event
  get: Function; // get a specific joystick
  destroy: Function; // destroy everything
  ids: number[]; // array of assigned ids
  id: number;
  options: JoyOptions;
}

interface JoystickProps extends JoyOptions {
  containerStyle?: CSSProperties;
  onMove?: ManagerEventHandler;
  onEnd?: ManagerEventHandler;
}

function Joystick({
  containerStyle,
  onMove,
  onEnd,
  ...joyOptions
}: JoystickProps) {
  const managerRef = useRef<Manager>(null!);

  useEffect(() => {
    if (!onMove) return;
    managerRef.current.on("move", onMove);

    return () => {
      managerRef.current.off("move", onMove);
    };
  }, [onMove]);

  useEffect(() => {
    if (!onEnd) return;
    managerRef.current.on("end", onEnd);

    return () => {
      managerRef.current.off("end", onEnd);
    };
  }, [onEnd]);

  useEffect(
    () => () => {
      // Remove all listeners on unmount.
      managerRef.current.off();
    },
    []
  );

  return (
    <BaseJoystick
      options={joyOptions}
      containerStyle={{ ...defaultContainerStyles, ...containerStyle }}
      managerListener={(manager: Manager) => (managerRef.current = manager)}
    />
  );
}

export { Joystick };
