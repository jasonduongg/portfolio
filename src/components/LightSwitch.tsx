import { useRef, useState, useEffect } from 'react';
import { Group, PointLight } from 'three';

export interface LightSwitchProps {
    position?: [number, number, number];
    onLightChange?: (isOn: boolean) => void;
}

export default function LightSwitch({ position = [0, 0, 0], onLightChange }: LightSwitchProps) {
    const groupRef = useRef<Group>(null);
    const [isOn, setIsOn] = useState(true);

    useEffect(() => {
        onLightChange?.(isOn);
    }, [isOn, onLightChange]);

    return (
        <group ref={groupRef} position={position}>
            {/* Backing plate */}
            <mesh position={[0, 0, -0.01]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.3, 0.4, 0.01]} />
                <meshStandardMaterial color="#f5e6d3" />
            </mesh>

            {/* Switch plate */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[0.15, 0.25, 0.02]} />
                <meshStandardMaterial color="#f5f5f5" />
            </mesh>

            {/* Switch toggle */}
            <mesh
                position={[0, isOn ? 0.05 : -0.05, 0.03]}
                rotation={[0, 0, 0]}
                onClick={() => setIsOn(!isOn)}
            >
                <boxGeometry args={[0.1, 0.1, 0.02]} />
                <meshStandardMaterial color={isOn ? "#4CAF50" : "#e0e0e0"} />
            </mesh>

            {/* Room light */}
            <pointLight
                position={[0, 2, 0]}
                intensity={isOn ? 1 : 0}
                distance={10}
                decay={2}
                color="#fff8e7"
            />
        </group>
    );
} 