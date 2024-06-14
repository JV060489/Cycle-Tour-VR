import {
  XR,
  NonImmersiveCamera,
  ImmersiveSessionOrigin,
  useEnterXR,
} from "@coconut-xr/natuerlich/react";
import { XWebPointers } from "@coconut-xr/xinteraction/react";
import {
  CuboidCollider,
  CylinderCollider,
  Physics,    
  RapierRigidBody,
  RigidBody,
  interactionGroups,
  useRevoluteJoint,

} from "@react-three/rapier";
import { Suspense, useEffect, useRef } from "react";
import { Model as Car } from "./car.js";
import { Environment, Gltf, OrbitControls } from "@react-three/drei";
import { Euler, Quaternion } from "three";
import { useStore } from "./state.js";
import { Controllers, Hands } from "@coconut-xr/natuerlich/defaults";
import { EngineAudio } from "./sound.js";
import { Speed } from "./state.js";
import { Cycle } from "./cycle.js";
import { Canvas } from '@react-three/fiber';
import { Box, Cylinder } from '@react-three/drei';

const options: XRSessionInit = {
  requiredFeatures: ["local-floor"],
  optionalFeatures: ["hand-tracking"],
};

export default function App() {
  const enterVR = useEnterXR("immersive-vr", options);
  useEffect(() => {
    const element = document.getElementById("enter-vr");
    if (element == null) {
      return;
    }

    element.addEventListener("click", enterVR);
    return () => element.removeEventListener("click", enterVR);
  }, []);
  return (
    <>
      <XR />
      
      <Speed />
      <Environment preset="sunset" blur={0.2} background />
      <XWebPointers />
      <Suspense>
        <Physics
          updatePriority={-50}
          maxStabilizationIterations={100}
          maxVelocityFrictionIterations={100}
          maxVelocityIterations={200}
        >
          <Suspense>
            <CarPhysics />
          </Suspense>
          <ambientLight intensity={10} />
          <directionalLight intensity={10} position={[1, 1, 1]} />
          <RigidBody gravityScale={0} position={[0, -5, 0]}>
            <Gltf scale={0.3} src="/auto/track.glb" />
          </RigidBody>
        </Physics>
      </Suspense>
    </>
  );
}

const wheelDefaultOrientation = new Quaternion().setFromEuler(
  new Euler(0, 0, Math.PI / 2)
);

const { motorRefs, steeringRefs } = useStore.getState();

// function VisualColliders() {
//   const wheelDefaultOrientation = [0, 0, Math.PI / 2]; // Adjust as needed for visualization

//   // Visual representation of each collider
//   return (
//     <>
//       {/* Main body */}
//       <Box args={[0.3, 1, 2]} position={[0, 0.85, 0]} wireframe>
//         <meshStandardMaterial attach="material" color="red" wireframe />
//       </Box>

//       {/* Steering boxes */}
//       <Box args={[0.1, 0.1, 0.1]} position={[0.5 * 0.35, 0.4, -3 * 0.35]} wireframe>
//         <meshStandardMaterial attach="material" color="blue" wireframe />
//       </Box>
//       <Box args={[0.1, 0.1, 0.1]} position={[-0.5 * 0.35, 0.4, -3 * 0.35]} wireframe>
//         <meshStandardMaterial attach="material" color="blue" wireframe />
//       </Box>

//       {/* Wheel cylinders */}
//       <Cylinder args={[0.35, 0.35, 0.2, 32]} position={[1 * 0.35, 0.4, 3 * 0.35]} rotation={wheelDefaultOrientation} wireframe>
//         <meshStandardMaterial attach="material" color="green" wireframe />
//       </Cylinder>
//       <Cylinder args={[0.35, 0.35, 0.2, 32]} position={[-1 * 0.35, 0.4, 3 * 0.35]} rotation={wheelDefaultOrientation} wireframe>
//         <meshStandardMaterial attach="material" color="green" wireframe />
//       </Cylinder>
//       <Cylinder args={[0.35, 0.35, 0.2, 32]} position={[1 * 0.35, 0.4, -3 * 0.35]} rotation={wheelDefaultOrientation} wireframe>
//         <meshStandardMaterial attach="material" color="green" wireframe />
//       </Cylinder>
//       <Cylinder args={[0.35, 0.35, 0.2, 32]} position={[-1 * 0.35, 0.4, -3 * 0.35]} rotation={wheelDefaultOrientation} wireframe>
//         <meshStandardMaterial attach="material" color="green" wireframe />
//       </Cylinder>
//     </>
//   );
// }



function CarPhysics() {

  const body = useRef<RapierRigidBody>(null);

  const wheel1 = useRef<RapierRigidBody>(null);
  const wheel2 = useRef<RapierRigidBody>(null);
  const wheel3 = useRef<RapierRigidBody>(null);
  const wheel4 = useRef<RapierRigidBody>(null);
  const stearing1 = useRef<RapierRigidBody>(null);
  const stearing2 = useRef<RapierRigidBody>(null);

  motorRefs[0] = useRevoluteJoint(wheel1, body, [
    [0, 0, 0],
    [3 * 0.35, 0.4, 5 * 0.35],
    [1, 0, 0],
  ]);

  motorRefs[1] = useRevoluteJoint(wheel2, body, [
    [0, 0, 0],
    [-3 * 0.35, 0.4, 5 * 0.35],
    [1, 0, 0],
  ]);

  useRevoluteJoint(wheel3, stearing1, [
    [0, 0, 0],
    [0.2, 0, 0],
    [1, 0, 0],
  ]);

  useRevoluteJoint(wheel4, stearing2, [
    [0, 0, 0],
    [-0.2, 0, 0],
    [1, 0, 0],
  ]);

  steeringRefs[0] = useRevoluteJoint(body, stearing1, [
    [3 * 0.35, 0.4, -5 * 0.35],
    [0, 0, 0],
    [0, 1, 0],
  ]);

  steeringRefs[1] = useRevoluteJoint(body, stearing2, [
    [-3 * 0.35, 0.4, -5 * 0.35],
    [0, 0, 0],
    [0, 1, 0],
  ]);

  const friction = 1.5
  const frictionFront = 1.4
  const weight = 10
  const weightWheels = 0.5
  const restitution = 0.0001

  return (
    <>
      <RigidBody ref={body} colliders={false} restitution={0.1}>
        <CuboidCollider
          collisionGroups={interactionGroups(1, 1)}
          position={[0, 0.85, 0]}
          args={[0.3, 0.7, 2]}
          mass={weight}
        >
          <Cycle scale={0.9} position={[-0.5, 0.26, 1.5]} />
          {/* <EngineAudio /> */}
          <NonImmersiveCamera position={[-0.5, 1.3, 5]} /> 
          <ImmersiveSessionOrigin position={[-0.5, 0.3, 2]}>
            <Hands type="grab" />
            <Controllers type="grab" />
          </ImmersiveSessionOrigin>
        </CuboidCollider>
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups([], [])}
        ref={stearing1}
        canSleep={false}
        position={[0.5 * 0.35, 0.4, -3 * 0.35]}
        restitution={0.01}
      >
        <CuboidCollider args={[0.1, 0.1, 0.1]} />
      </RigidBody>
      <RigidBody
        collisionGroups={interactionGroups([], [])}
        ref={stearing2}
        position={[-0.5 * 0.35, 0.4, -3 * 0.35]}
        canSleep={false}
        restitution={0.01}
      >
        <CuboidCollider args={[0.1, 0.1, 0.1]} />
      </RigidBody>
      <RigidBody
        canSleep={false}
        ref={wheel1}
        position={[0.5 * 0.35, 0.4, 3 * 0.35]}
        colliders={false}
        restitution={restitution}
        friction={friction}
        mass={weightWheels}
        collisionGroups={interactionGroups(0, 0)}
      >
        <CylinderCollider
          quaternion={wheelDefaultOrientation}
          args={[0.2, 0.35]}
        />
      </RigidBody>
      <RigidBody
        canSleep={false}
        ref={wheel2}
        position={[-0.5 * 0.35, 0.4, 3 * 0.35]}
        colliders={false}
        restitution={restitution}
        friction={friction}
        mass={weightWheels}
        collisionGroups={interactionGroups(0, 0)}
      >
        <CylinderCollider
          quaternion={wheelDefaultOrientation}
          args={[0.2, 0.35]}
        />
      </RigidBody>
      <RigidBody
        canSleep={false}
        ref={wheel3}
        position={[0.5 * 0.35, 0.4, -3 * 0.35]}
        colliders={false}
        restitution={restitution}
        friction={friction}
        mass={weightWheels}
        collisionGroups={interactionGroups(0, 0)}
      >
        <CylinderCollider
          quaternion={wheelDefaultOrientation}
          args={[0.2, 0.35]}
        />
      </RigidBody>
      <RigidBody
        canSleep={false}
        ref={wheel4}
        position={[-0.5 * 0.35, 0.4, -3 * 0.35]}
        colliders={false}
        restitution={restitution}
        friction={friction}
        mass={weightWheels}
        collisionGroups={interactionGroups(0, 0)}
      >
        <CylinderCollider
          quaternion={wheelDefaultOrientation}
          args={[0.2, 0.35]}
        />
      </RigidBody>
    </>
  );
}
