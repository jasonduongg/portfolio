'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Group, TextureLoader, RepeatWrapping } from 'three';
import Desk from './Desk';
import Monitor from './Monitor';
import Keyboard from './Keyboard';
import LightSwitch from './LightSwitch';
import ResumePaper from './ResumePaper';

interface RoomProps {
    onLightChange?: (isOn: boolean) => void;
    lightsOn?: boolean;
    isFreeForm?: boolean;
}

export default function Room({ onLightChange, lightsOn = true, isFreeForm = false }: RoomProps) {
    const groupRef = useRef<Group>(null);

    useEffect(() => {
        const textureLoader = new TextureLoader();

        // Add error handling for texture loading
        textureLoader.load(
            '/textures/wall.jpg',
            (texture) => {
                texture.wrapS = texture.wrapT = RepeatWrapping;
                texture.repeat.set(3, 3);

                if (groupRef.current) {
                    const backWall = groupRef.current.children.find(
                        child => child.position.z === -2
                    ) as THREE.Mesh;
                    if (backWall) {
                        const material = backWall.material as THREE.MeshStandardMaterial;
                        material.map = texture;
                        material.roughness = 0.5;  // Reduced roughness
                        material.metalness = 0.0;  // Reduced metalness
                        material.needsUpdate = true;  // Force material update
                    }
                }
            },
            undefined,  // onProgress callback
            (error) => {
                console.error('Error loading wall texture:', error);
            }
        );
    }, []);

    return (
        <group ref={groupRef}>
            {/* Back Wall */}
            <mesh position={[0, 0, -2]} rotation={[0, 0, 0]}>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="" /> {/* Dark wood color as base */}
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
            <ResumePaper position={[-1.2, -1.4, -0.8]} isFreeForm={isFreeForm} />
        </group>
    );
} 