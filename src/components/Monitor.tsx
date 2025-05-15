'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3, Raycaster, Vector2, PerspectiveCamera } from 'three';
import { Text } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { ColorBurst, SHOOT_DURATION } from './ColorBurst';

interface MonitorProps {
    position?: [number, number, number];
}

function Button({ position, text, onClick, isHovered, onHover }: { position: [number, number, number], text: string, onClick: () => void, isHovered: boolean, onHover: (hovered: boolean) => void }) {
    return (
        <group
            position={position}
            onPointerOver={(e) => {
                e.stopPropagation();
                onHover(true);
            }}
            onPointerOut={(e) => {
                e.stopPropagation();
                onHover(false);
            }}
        >
            {/* Button Background */}
            <mesh onClick={onClick}>
                <planeGeometry args={[0.7, 0.15]} />
                <meshStandardMaterial
                    color={isHovered ? "#4a4a4a" : "#2a2a2a"}
                    emissive={isHovered ? "#2a2a2a" : "#000000"}
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Button Text */}
            <Text
                position={[0, 0, 0.01]}
                fontSize={0.07}
                color={isHovered ? "#ffffff" : "#00ff00"}
                anchorX="center"
                anchorY="middle"
                font="/fonts/SAOUI-Regular.otf"
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
                    <meshStandardMaterial
                        color="#ff5f56"
                        emissive="#ff5f56"
                        emissiveIntensity={0.5}
                    />
                </mesh>
                {/* Minimize Button */}
                <mesh position={[0.00, 0, 0]}>
                    <circleGeometry args={[0.02, 32]} />
                    <meshStandardMaterial
                        color="#ffbd2e"
                        emissive="#ffbd2e"
                        emissiveIntensity={0.5}
                    />
                </mesh>
                {/* Maximize Button */}
                <mesh position={[0.075, 0, 0]}>
                    <circleGeometry args={[0.02, 32]} />
                    <meshStandardMaterial
                        color="#27c93f"
                        emissive="#27c93f"
                        emissiveIntensity={0.5}
                    />
                </mesh>
            </group>


            {/* URL Bar */}
            <group position={[0, 0.65, 0.01]}>
                <mesh position={[0, 0, 0.02]}>
                    <planeGeometry args={[2, 0.08]} />
                    <meshStandardMaterial
                        color="#D3D3D3"
                        emissive="#D3D3D3"
                        emissiveIntensity={0.3}
                    />
                </mesh>

                {/* URL Text */}
                <Text
                    position={[-0.9, 0, 0.03]}
                    fontSize={0.05}
                    color="#000000"
                    anchorX="left"
                    anchorY="middle"
                    font="/fonts/SAOUI-Regular.otf"
                >
                    jasonduong.dev
                </Text>
            </group>

            {/* Content Area Background */}
            <mesh position={[0, 0.1, 0.01]}>
                <planeGeometry args={[2.6, 1.3]} />
                <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.2}
                />
            </mesh>
        </group>
    );
}

function ResumeButton({ position }: { position: [number, number, number] }) {
    const [hovered, setHovered] = useState(false);

    const handleResumeClick = () => {
        // Create a link element and trigger download
        const link = document.createElement('a');
        link.href = '/resume.pdf';
        link.download = 'Jason_Duong_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button
            position={position}
            text="Download Resume"
            onClick={handleResumeClick}
            isHovered={hovered}
            onHover={setHovered}
        />
    );
}

function BrowserOverlay({ position, onProjectsClick, onLeetCodeClick }: {
    position: [number, number, number],
    onProjectsClick: () => void,
    onLeetCodeClick: () => void
}) {
    const [hoveredProjects, setHoveredProjects] = useState(false);
    const [hoveredLeetCode, setHoveredLeetCode] = useState(false);

    return (
        <group position={position}>
            {/* Overlay Background - Same size as content area */}
            <mesh
                position={[0, 0.1, 0]}
                userData={{ isButton: true }}
            >
                <planeGeometry args={[2.6, 1.3]} />
                <meshStandardMaterial
                    color={'rgba(255, 255, 255, 0)'}
                    transparent={true}
                    opacity={0.0}
                />
            </mesh>

            {/* Projects Button */}
            <Button
                position={[-0.75, 0.40, 0.01]}
                text="View Projects"
                onClick={onProjectsClick}
                isHovered={hoveredProjects}
                onHover={setHoveredProjects}
            />

            {/* LeetCode Button */}
            <Button
                position={[-0.75, 0.2, 0.01]}
                text="View LeetCode"
                onClick={onLeetCodeClick}
                isHovered={hoveredLeetCode}
                onHover={setHoveredLeetCode}
            />

            <ResumeButton position={[-0.75, 0.0, 0.01]} />
        </group>
    );
}

export default function Monitor({ position = [0, 0, -1] }: MonitorProps) {
    const groupRef = useRef<Group>(null);
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [showProjectsBurst, setShowProjectsBurst] = useState(false);
    const [showLeetCodeBurst, setShowLeetCodeBurst] = useState(false);
    const { camera, raycaster, mouse } = useThree();
    const router = useRouter();
    const [burstProgress, setBurstProgress] = useState(0);
    const initialCameraZ = useRef(camera.position.z);
    const initialCameraY = useRef(camera.position.y);
    const [cameraStartTime, setCameraStartTime] = useState<number | null>(null);

    // Handle camera movement based on burst progress
    useFrame(() => {
        if ((showProjectsBurst || showLeetCodeBurst) && camera instanceof PerspectiveCamera) {
            const now = performance.now() / 1000;

            // Start camera movement after a delay of 0.5 seconds
            if (!cameraStartTime) {
                setCameraStartTime(now);
                return;
            }

            const cameraElapsed = now - cameraStartTime;
            if (cameraElapsed < 0.5) return; // Wait for 0.5 seconds before starting

            // Calculate camera progress with easing
            const cameraProgress = Math.min((cameraElapsed - 0.5) / (SHOOT_DURATION - 0.5), 1);
            const easedProgress = cameraProgress * cameraProgress; // Quadratic easing for slower start

            // Move camera forward and up
            const targetZ = initialCameraZ.current - (1 * easedProgress);
            const targetY = initialCameraY.current + (0.15 * easedProgress);

            // Slower interpolation
            camera.position.z += (targetZ - camera.position.z) * 0.05;
            camera.position.y += (targetY - camera.position.y) * 0.05;
        }
    });

    // Store initial camera position when burst starts
    useEffect(() => {
        if (showProjectsBurst || showLeetCodeBurst) {
            initialCameraZ.current = camera.position.z;
            initialCameraY.current = camera.position.y;
            setCameraStartTime(null); // Reset camera start time
        }
    }, [showProjectsBurst, showLeetCodeBurst, camera]);

    // Handler for the overlay/button clicks
    const handleProjectsClick = () => {
        setShowProjectsBurst(true);
    };

    const handleLeetCodeClick = () => {
        setShowLeetCodeBurst(true);
    };

    return (
        <group ref={groupRef} position={position}>
            {/* Monitor Screen */}
            <mesh position={[0, 0.8, 0]}>
                <boxGeometry args={[3, 1.8, 0.1]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#1a1a1a"
                    emissiveIntensity={0.2}
                />
            </mesh>

            {/* Screen Display */}
            <mesh position={[0, 0.8, 0.06]}>
                <planeGeometry args={[2.8, 1.6]} />
                <meshStandardMaterial
                    color="#1e3a8a"
                    emissive="#1e3a8a"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Browser UI */}
            <BrowserChrome position={[0, 0.75, 0.10]} />

            {/* Browser Overlay and Resume Button */}
            {!showProjectsBurst && !showLeetCodeBurst && (
                <group>
                    <BrowserOverlay
                        position={[0, 0.75, 0.2]}
                        onProjectsClick={handleProjectsClick}
                        onLeetCodeClick={handleLeetCodeClick}
                    />
                </group>
            )}

            {/* Color Burst Animations */}
            {showProjectsBurst && (
                <group position={[0, 0.8, 0.2]}>
                    <ColorBurst
                        onComplete={() => router.push('/projects')}
                        onProgress={setBurstProgress}
                    />
                </group>
            )}
            {showLeetCodeBurst && (
                <group position={[0, 0.8, 0.2]}>
                    <ColorBurst
                        onComplete={() => router.push('/leetcode')}
                        onProgress={setBurstProgress}
                    />
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