'use client';

import { useRef } from 'react';
import { Group } from 'three';
import Desk from './Desk';
import Monitor from './Monitor';
import Keyboard from './Keyboard';
import LightSwitch from './LightSwitch';

interface RoomProps {
    onLightChange?: (isOn: boolean) => void;
    lightsOn?: boolean;
}

export default function Room({ onLightChange, lightsOn = true }: RoomProps) {
    const groupRef = useRef<Group>(null);

    return (
        <group ref={groupRef}>
            {/* Back Wall */}
            <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#f5f5f5" /> {/* Light gray color for wall */}
            </mesh>

            {/* Floor */}
            <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#d2b48c" /> {/* Tan color for floor */}
            </mesh>

            <Monitor position={[0, -1.1, -1.4]} />
            <Desk />
            <Keyboard position={[0, -1.4, -0.8]} lightsOn={lightsOn} />
            <LightSwitch position={[3, -0.75, -1.99]} onLightChange={onLightChange} />
        </group>
    );
} 