import { RootState, useFrame } from "@react-three/fiber";
import { useState } from "react";

interface StateType {
  onEnter?: (previousState: StateType) => void;
  onExit?: () => void;
  onUpdate?: (state: RootState, delta: number) => void;
}

function useStateMachine(states: { [key: string]: StateType }) {
  const [activeState, setActiveState] = useState<string>(null!);

  function changeActiveState(newActiveState: string) {
    setActiveState((previousActiveState) => {
      if (newActiveState === previousActiveState) return previousActiveState;
      const previousState = states?.[previousActiveState];
      if (previousState) {
        previousState?.onExit?.();
      }

      states?.[newActiveState]?.onEnter?.(previousState);

      return newActiveState;
    });
  }

  useFrame((...params) => {
    states?.[activeState]?.onUpdate?.(...params);
  });

  return { changeActiveState, activeState };
}

export default useStateMachine;
