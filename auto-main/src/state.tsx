import { RefObject, useEffect, useState } from "react";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { RevoluteImpulseJoint } from "@dimforge/rapier3d-compat";
import { KeyboardControls } from "@react-three/drei";

type State = {
  updateControls(): unknown;
  interacted: boolean;
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  keyboardSpeed: number;
  keyboardSteering: number; 
  nauterlichSpeed: number;
  natuerlichSteering: number;
  steering: number;
  speed: number;
  speed1: number;
  potentiometerValue: number;
  steeringRefs: Array<RefObject<RevoluteImpulseJoint | undefined>>;
  motorRefs: Array<RefObject<RevoluteImpulseJoint | undefined>>;
};

const initialState: State = {
  down: false,
  up: false,
  left: false,
  right: false,
  keyboardSpeed: 0,
  keyboardSteering: 0,
  natuerlichSteering: 0,
  nauterlichSpeed: 0,
  steering: 0,
  speed: 0,
  speed1: 0,
  potentiometerValue: 0,
  motorRefs: [],
  steeringRefs: [],
  interacted: false,
  updateControls: function (): unknown {
    throw new Error("Function not implemented.");
  }
};


export function Speed() {
  const setSpeed1 = useStore((state) => state.setSpeed1);
  const setPotentiometerValue = useStore((state) => state.setPotentiometerValue);

  useEffect(() => {
    console.time('FetchStart');
    const fetchData = async () => {
      try {
        const [speedResp, steeringResp] = await Promise.all([
          fetch('https://192.168.137.230:8081/speed'),
          fetch('https://192.168.137.230:8081/potentiometer'),
        ]);
        console.log(speedResp)




        const speedData = await speedResp.json();
        const steeringData = await steeringResp.json();

        setSpeed1(speedData.speed_level); // Update the store with fetched speed
        setPotentiometerValue(steeringData.potentiometer_voltage);
        console.log(speedData.speed_level)
        

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };


    fetchData();
    const intervalId = setInterval(fetchData, 500); // Fetch data every 500ms
    console.time('fetchData Duration');

    return () => clearInterval(intervalId);
  }, [setSpeed1, setPotentiometerValue]); // Depend on setSpeed1 and setPotentiometerValue to avoid stale closures

  return (
    <>
    </>
  );
}

export const useStore = create(
  combine(initialState, (set, get) => ({
    onClick() {
      set({ interacted: true });
    },
    updateControls() {
      const {
        motorRefs,
        steeringRefs,
        keyboardSpeed,
        keyboardSteering,
        natuerlichSteering,
        nauterlichSpeed,
        speed1,
        potentiometerValue,
      } = get();
      const speed =  speed1 * 4;
      const valueWithTwoDecimals = parseFloat(potentiometerValue.toFixed(2));
      const steering = -(valueWithTwoDecimals - 1.69) * 100;
      console.log("Steering:", -(valueWithTwoDecimals - 1.45));
      set({ steering, speed });
      for (const ref of motorRefs) {
        if (ref.current == null) {
          continue;
        }
        ref.current.configureMotorVelocity(speed, 1000);
      }
      for (const ref of steeringRefs) {
        if (ref.current == null) {
          continue;
        }
        ref.current.configureMotorPosition(steering, 1000000, 5);
      }
    },
    setSpeed1(speed1: number) {
      set({ speed1 });
      get().updateControls(); // Call updateControls after setting speed1
    },
    setPotentiometerValue(potentiometerValue: number) {
      set({ potentiometerValue });
      get().updateControls();
    },
    setNatuerlichSteering(natuerlichSteering: number) {
      set({
        natuerlichSteering,
      });
      this.updateControls();
    },
    setNatuerlichSpeed(nauterlichSpeed: number) {
      set({
        nauterlichSpeed,
      });
      this.updateControls();
    },
    updateKeyboard() {
      const { up, down, left, right } = get();
      let keyboardSpeed = 0;
      let keyboardSteering = 0;
      if (up) {
        keyboardSpeed += 10;
      }
      if (down) {
        keyboardSpeed -= 20;
      }
      if (right) {
        keyboardSteering += 50;
      }
      if (left) {
        keyboardSteering -= 50;
      }
      set({
        keyboardSpeed,
        keyboardSteering,
      });
      this.updateControls();
    },
    onKeyDown(key: string) {
      switch (key) {
        case "ArrowUp":
          set({ up: true });
          break;
        case "ArrowDown":
          set({ down: true });
          break;
        case "ArrowLeft":
          set({ left: true });
          break;
        case "ArrowRight":
          set({ right: true });
          break;
        default:
          return;
      }
      this.updateKeyboard();
    },
    onKeyUp(key: string) {
      switch (key) {
        case "ArrowUp":
          set({ up: false });
          break;
        case "ArrowDown":
          set({ down: false });
          break;
        case "ArrowLeft":
          set({ left: false });
          break;
        case "ArrowRight":
          set({ right: false });
          break;
        default:
          return;
      }
      this.updateKeyboard();
    },
  }))

);

window.addEventListener("keydown", (e) => {
  useStore.getState().onKeyDown(e.key);
});

window.addEventListener("keyup", (e) => {
  useStore.getState().onKeyUp(e.key);
});

window.addEventListener("click", useStore.getState().onClick);