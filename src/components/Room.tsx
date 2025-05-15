'use client';

import { useRef } from 'react';
import { Group } from 'three';
import Desk from './Desk';
import Monitor from './Monitor';

export default function Room() {
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
        </group>
    );
} 