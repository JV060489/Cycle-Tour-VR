import * as THREE from 'three';
import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

import {
  BufferGeometry,
  Euler,
  Group,
  Material,
  Mesh, 
  Plane,
  Quaternion,
  Vector3,
} from "three";
import { isXIntersection } from "@coconut-xr/xinteraction";
import { CylinderCollider, RigidBody } from "@react-three/rapier";
import { useStore } from "./state.js";
import { useFrame } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    Circle_1: THREE.Mesh;
    Circle_2: THREE.Mesh;
    Circle002: THREE.Mesh;
    Circle003: THREE.Mesh;
    Cube: THREE.Mesh;
    Cube001: THREE.Mesh;
    Cube003: THREE.Mesh;
    Cube004: THREE.Mesh;
    Cube007: THREE.Mesh;
    Cube008: THREE.Mesh;
    Cube009: THREE.Mesh;
    Cube010: THREE.Mesh;
    Cube014: THREE.Mesh;
    Cube018: THREE.Mesh;
    Cube019: THREE.Mesh;
    Cube019_1: THREE.Mesh;
    Cube024: THREE.Mesh;
    Cylinder: THREE.Mesh;
    Cylinder023: THREE.Mesh;
    Cylinder037: THREE.Mesh;
    Cylinder038: THREE.Mesh;
    Cylinder040: THREE.Mesh;
    Cylinder042: THREE.Mesh;
    Cylinder043: THREE.Mesh;
    Cylinder044: THREE.Mesh;
    Cylinder046: THREE.Mesh;
    Cylinder085: THREE.Mesh;
    Cylinder086: THREE.Mesh;
    Cylinder087: THREE.Mesh;
    Cylinder088: THREE.Mesh;
    Cylinder020: THREE.Mesh;
    Cylinder020_1: THREE.Mesh;
    Cylinder014: THREE.Mesh;
    Cylinder014_1: THREE.Mesh;
    Cylinder015: THREE.Mesh;
    Cylinder015_1: THREE.Mesh;
    HandleBar: THREE.Mesh;
    Pedal: THREE.Mesh;
  };
  materials: {
    ['Material.001']: THREE.MeshStandardMaterial;
    ['Material.002']: THREE.MeshStandardMaterial;
    ['Material.004']: THREE.MeshStandardMaterial;
    ['Material.008']: THREE.MeshStandardMaterial;
    ['Material.009']: THREE.MeshStandardMaterial;
    ['Material.010']: THREE.MeshStandardMaterial;
    Material: THREE.MeshStandardMaterial;
    Silver: THREE.MeshStandardMaterial;
    Black: THREE.MeshStandardMaterial;
  };
};

export function Cycle(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/FinalCycle.glb') as GLTFResult;


  const steeringValue = useStore(state => state.steering);
  const currentPointToObjectNormal = new Vector3();
  const wheelRotationPlaneNormal = new Vector3(0, 1, 0).applyEuler(
    new Euler(28 * (Math.PI / 180), 0, 0)
  );
  const mapRange = (value: number, inputMin: number, inputMax: number, outputMin: number, outputMax: number) => {
    return outputMin + ((outputMax - outputMin) * (value - inputMin) / (inputMax - inputMin));
  };

  const handlebarRef = useRef<Mesh>(null);
  const cubeRef = useRef<Group>(null);
  useFrame(() => {
    if (handlebarRef.current) {
      const pivotX = 0.0032; // Adjust these values as needed
      const pivotY = -0.064;   // Adjust these values as needed
      const pivotZ = -0.96;   // Adjust these values as needed

      handlebarRef.current.position.set(pivotX, pivotY, pivotZ);

      
      // Assuming potentiometerValue ranges from 0 to 1 and maps to handlebar rotation
      const rotationValue = mapRange(steeringValue, 100, -100, -Math.PI / 2, Math.PI / 2);
      handlebarRef.current?.quaternion.setFromAxisAngle(
        wheelRotationPlaneNormal,
        rotationValue
      );
    }
  });
  
  return (
    <group {...props} dispose={null}>
      <group position={[-0.005, -0.405, 0.98]} rotation={[0, 0, -Math.PI / 2]} scale={0.544}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle_1.geometry}
          material={materials['Material.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Circle_2.geometry}
          material={materials['Material.002']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle002.geometry}
        material={materials['Material.009']}
        position={[-0.031, -0.401, 0.982]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={0.113}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Circle003.geometry}
        material={materials.Silver}
        position={[0.058, -0.522, 0.682]}
        rotation={[3.138, 0.03, 1.579]}
        scale={0.009}
      />
      <group ref = {cubeRef}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          material={materials.Material}
          position={[0, 0.362, -0.659]}
          scale={[-0.036, -0.068, -0.068]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube001.geometry}
        material={materials.Material}
        position={[0, 0.407, 0.45]}
        scale={[-0.021, -0.048, -0.048]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube003.geometry}
        material={materials['Material.001']}
        position={[0, 0.459, 0.419]}
        scale={[-0.012, -0.018, -0.018]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004.geometry}
        material={materials['Material.002']}
        position={[0, 0.939, 0.758]}
        scale={[0.046, 0.037, 0.04]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube007.geometry}
        material={materials['Material.004']}
        position={[-0.001, -0.145, -0.098]}
        rotation={[0.847, -0.001, -0.006]}
        scale={[0.006, 0.002, 0.214]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008.geometry}
        material={materials['Material.004']}
        position={[-0.001, -0.177, 0.232]}
        rotation={[1.832, -0.01, 3.005]}
        scale={[0.006, 0.002, 0.214]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube009.geometry}
        material={nodes.Cube009.material}
        position={[0.062, -0.396, 0.997]}
        rotation={[1.11, 0, 0]}
        scale={[0.004, 0.011, 0.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube010.geometry}
        material={nodes.Cube010.material}
        position={[0.81, -1.007, 0.468]}
        scale={0.27}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014.geometry}
        material={materials['Material.001']}
        position={[0, 0.565, -0.608]}
        scale={[0.038, 0.016, 0.045]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube018.geometry}
        material={materials['Material.001']}
        position={[-0.091, -0.403, 0.983]}
        rotation={[0, 0, 0.496]}
        scale={[0.01, 0.01, 0.008]}
      />
      <group
        position={[-0.052, -0.294, 0.983]}
        rotation={[-0.684, -0.052, 0.015]}
        scale={[0.007, 0.059, 0.007]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube019.geometry}
          material={materials['Material.008']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube019_1.geometry}
          material={materials['Material.001']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube024.geometry}
        material={materials['Material.004']}
        position={[0.058, -0.294, 0.231]}
        scale={0.019}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder.geometry}
        material={materials['Material.004']}
        position={[0, -0.322, 0.241]}
        rotation={[0.265, 0, 0]}
        scale={[0.022, 0.009, 0.049]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder023.geometry}
        material={materials['Material.008']}
        position={[0, -0.141, 0.837]}
        rotation={[-0.706, 0, 0]}
        scale={[-0.002, -0.255, -0.002]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder037.geometry}
        material={materials.Silver}
        position={[0, -0.405, 0.982]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[0.047, 0.019, 0.047]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder038.geometry}
        material={materials['Material.009']}
        position={[0.019, -0.403, 0.982]}
        rotation={[-Math.PI, 0, -Math.PI / 2]}
        scale={[-0.419, -0.003, -0.419]}
      />
      <group
        position={[0.064, -0.543, 0.191]}
        rotation={[1.582, 0, -Math.PI / 2]}
        scale={[0.185, 0.002, 0.185]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder014.geometry}
          material={materials['Material.004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder014_1.geometry}
          material={materials.Silver}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder040.geometry}
        material={materials['Material.004']}
        position={[0.009, -0.544, 0.187]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[0.024, 0.06, 0.024]}
      />
      <group
        position={[-0.001, -0.08, -0.093]}
        rotation={[-0.726, 0, 0]}
        scale={[0.045, 0.066, 0.045]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder015.geometry}
          material={materials['Material.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder015_1.geometry}
          material={materials['Material.001']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder042.geometry}
        material={materials['Material.001']}
        position={[0.062, -0.402, 0.983]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={0.014}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder043.geometry}
        material={materials['Material.008']}
        position={[0.062, -0.425, 1.001]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[-0.013, -0.004, -0.013]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder044.geometry}
        material={materials['Material.010']}
        position={[0.11, -0.86, 0.117]}
        rotation={[0, 0, -Math.PI / 2]}
        scale={[0.004, 0.005, 0.004]}
      />
      <group
        position={[0.091, -0.677, 0.956]}
        rotation={[0.389, 0, Math.PI / 2]}
        scale={[-0.046, -0.001, -0.046]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder020.geometry}
          material={materials.Silver}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cylinder020_1.geometry}
          material={materials['Material.001']}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder046.geometry}
        material={materials['Material.001']}
        position={[-0.059, -0.402, 0.983]}
        rotation={[Math.PI, 0, Math.PI / 2]}
        scale={0.014}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder085.geometry}
        material={materials['Material.010']}
        position={[-0.092, -0.228, 0.263]}
        rotation={[0, 0, Math.PI / 2]}
        scale={[0.004, 0.006, 0.004]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder086.geometry}
        material={materials['Material.001']}
        position={[0, 0.277, -0.681]}
        rotation={[0.313, 0, 0]}
        scale={-0.023}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder087.geometry}
        material={materials['Material.001']}
        position={[0.003, -0.863, -0.979]}
        rotation={[-Math.PI, 0, -3.112]}
        scale={0.004}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder088.geometry}
        material={materials['Material.001']}
        position={[0.003, -0.664, 1.362]}
        rotation={[2.249, 0, -3.112]}
        scale={0.004}
      />
     
        <mesh
          ref={handlebarRef}
          castShadow
          receiveShadow
          geometry={nodes.HandleBar.geometry}
          material={materials.Black}
          position={[-0.002, -0.064, -0.96]}
          scale={[-0.025, -0.036, -0.025]}
        />
      
      
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Pedal.geometry}
        material={materials.Silver}
        position={[0.084, -0.53, 0.218]}
        rotation={[-0.327, -0.022, -1.537]}
        scale={[0.032, 0.006, 0.029]}
      />
    </group>
  );
}

useGLTF.preload('/FinalCycle.glb');
