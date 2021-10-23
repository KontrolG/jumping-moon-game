import { useThree } from "@react-three/fiber";

function useCamera() {
  return useThree((state) => state.camera);
}

export default useCamera;
