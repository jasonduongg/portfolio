'use client';

import { useRef } from 'react';
import { Group } from 'three';

export default function Desk() {
    const groupRef = useRef<Group>(null);

    return (
        <group ref={groupRef} position={[0, -1.5, -1]}>
            {/* Desk Surface */}
            <mesh>
                <boxGeometry args={[4, 0.1, 2]} />
                <meshStandardMaterial color="#8B4513" /> {/* Brown color */}
            </mesh>

            {/* Desk Legs */}
            <mesh position={[-1.8, -1, 0.8]}>
                <boxGeometry args={[0.1, 2, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[1.8, -1, 0.8]}>
                <boxGeometry args={[0.1, 2, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[-1.8, -1, -0.8]}>
                <boxGeometry args={[0.1, 2, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[1.8, -1, -0.8]}>
                <boxGeometry args={[0.1, 2, 0.1]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
        </group>
    );
} 