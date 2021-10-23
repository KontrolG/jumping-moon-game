import { useEffect, useState } from "react";

// Esto puede albergarse en un state global.
function useKeyboardInput() {
  const [state, setState] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    space: false,
    shift: false
  });

  function updateState(partialState: Partial<typeof state>) {
    setState((state) => ({
      ...state,
      ...partialState
    }));
  }

  function onKeyDown(event: any) {
    switch (event.keyCode) {
      case 87: // w
        updateState({ forward: true });
        break;
      case 65: // a
        updateState({ left: true });
        break;
      case 83: // s
        updateState({ backward: true });
        break;
      case 68: // d
        updateState({ right: true });
        break;
      case 32: // SPACE
        updateState({ space: true });
        break;
      case 16: // SHIFT
        updateState({ shift: true });
        break;
    }
  }

  function onKeyUp(event: any) {
    switch (event.keyCode) {
      case 87: // w
        updateState({ forward: false });
        break;
      case 65: // a
        updateState({ left: false });
        break;
      case 83: // s
        updateState({ backward: false });
        break;
      case 68: // d
        updateState({ right: false });
        break;
      case 32: // SPACE
        updateState({ space: false });
        break;
      case 16: // SHIFT
        updateState({ shift: false });
        break;
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("keyup", onKeyUp, false);
    };
  }, []);

  return state;
}

export default useKeyboardInput;
