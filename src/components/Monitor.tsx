'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3, Raycaster, Vector2 } from 'three';
import { Text } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { ColorBurst } from './ColorBurst';

interface MonitorProps {
    position?: [number, number, number];
}

function Button({ position, text, onClick, isHovered }: { position: [number, number, number], text: string, onClick: () => void, isHovered: boolean }) {
    return (
        <group position={position}>
            {/* Button Background */}
            <mesh onClick={onClick}>
                <planeGeometry args={[1.2, 0.4]} />
                <meshStandardMaterial
                    color={isHovered ? "#4a4a4a" : "#2a2a2a"}
                    emissive={isHovered ? "#2a2a2a" : "#000000"}
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Button Text */}
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.15}
                color={isHovered ? "#ffffff" : "#00ff00"}
                anchorX="center"
                anchorY="middle"
            >
                {text}
            </Text>
        </group>
    );
}

function BrowserChrome({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>

            {/* Browser Controls */}
            <group position={[-1.15, 0.65, 0.02]}>
                {/* Close Button */}
                <mesh position={[-0.075, 0, 0]}>
                    <circleGeometry args={[0.02, 32]} />
                    <meshStandardMaterial color="#ff5f56" />
                </mesh>
                {/* Minimize Button */}
                <mesh position={[0.00, 0, 0]}>
                    <circleGeometry args={[0.02, 32]} />
                    <meshStandardMaterial color="#ffbd2e" />
                </mesh>
                {/* Maximize Button */}
                <mesh position={[0.075, 0, 0]}>
                    <circleGeometry args={[0.02, 32]} />
                    <meshStandardMaterial color="#27c93f" />
                </mesh>
            </group>


            {/* URL Bar */}
            <group position={[0, 0.65, 0.01]}>
                <mesh position={[0, 0, 0.02]}>
                    <planeGeometry args={[2, 0.08]} />
                    <meshStandardMaterial color="#D3D3D3" />
                </mesh>

                {/* URL Text */}
                <Text
                    position={[-0.9, 0, 0.03]}
                    fontSize={0.05}
                    color="#000000"
                    anchorX="left"
                    anchorY="middle"
                >
                    jasonduong.dev
                </Text>
            </group>

            {/* Content Area Background */}
            <mesh position={[0, 0.1, 0.01]}>
                <planeGeometry args={[2.6, 1.3]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}

function BrowserOverlay({ position, onProjectsClick }: { position: [number, number, number], onProjectsClick: () => void }) {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);

    return (
        <group position={position}>
            {/* Overlay Background - Same size as content area */}
            <mesh
                position={[0, 0.1, 0]}
                userData={{ isButton: true, buttonId: 'overlay' }}
                onPointerOver={() => setHoveredButton('overlay')}
                onPointerOut={() => setHoveredButton(null)}
                onClick={onProjectsClick}
            >
                <planeGeometry args={[2.6, 1.3]} />
                <meshStandardMaterial
                    color={hoveredButton === 'overlay' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0)'}
                    transparent={true}
                    opacity={hoveredButton === 'overlay' ? 0.1 : 0}
                />
            </mesh>

            {/* Example Button */}
            <Button
                position={[0, 0, 0.01]}
                text="View Projects"
                onClick={onProjectsClick}
                isHovered={hoveredButton === 'overlay'}
            />
        </group>
    );
}

export default function Monitor({ position = [0, 0, -1] }: MonitorProps) {
    const groupRef = useRef<Group>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [showBurst, setShowBurst] = useState(false);
    const { camera, raycaster, mouse } = useThree();
    const router = useRouter();

    // Handler for the overlay/button click
    const handleProjectsClick = () => {
        setShowBurst(true);
    };

    return (
        <group ref={groupRef} position={position}>
            {/* Monitor Screen */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[3, 1.8, 0.1]} />
                <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Screen Display */}
            <mesh position={[0, 0.8, 0.06]}>
                <planeGeometry args={[2.8, 1.6]} />
                <meshStandardMaterial color="#1e3a8a" />
            </mesh>

            {/* Browser UI */}
            <BrowserChrome position={[0, 0.75, 0.10]} />

            {/* Browser Overlay - positioned above BrowserChrome */}
            {!showBurst && (
                <BrowserOverlay position={[0, 0.75, 0.2]} onProjectsClick={handleProjectsClick} />
            )}

            {/* Color Burst Animation */}
            {showBurst && (
                <group position={[0, 0.8, 0.2]}>
                    <ColorBurst onComplete={() => console.log('complete')} />
                </group>
            )}

            {/* Monitor Stand */}
            <mesh position={[0, 0, -0.2]}>
                <boxGeometry args={[0.3, 0.6, 0.3]} />
                <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
            </mesh>

            {/* Monitor Base */}
            <mesh position={[0, -0.3, -0.2]}>
                <boxGeometry args={[1.5, 0.1, 0.8]} />
                <meshStandardMaterial color="#333" metalness={0.5} roughness={0.5} />
            </mesh>
        </group>
    );
} 