import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';

const RAY_LENGTH = 1.2;
const RAY_RADIUS = 0.03;
const CENTER_SPHERE_RADIUS = 0.22;
const BURST_DISTANCE = 1.2; // How far rays fly toward the camera (z)
export const SHOOT_DURATION = 5; // seconds
const RAY_ANIMATION_DURATION = 0.7; // seconds each ray animates outward
const MAX_RAYS = 200; // Increased from 120 to create more rays

// Add type for the onProgress callback
interface ColorBurstProps {
    onComplete: () => void;
    onProgress?: (progress: number) => void;
}

function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 90%, 55%)`;
}

function easeInCubic(t: number) {
    return t * t * t;
}

// Add new easing function for ray acceleration
function easeInQuad(t: number) {
    return t * t;
}

export function ColorBurst({ onComplete, onProgress }: ColorBurstProps) {
    const group = useRef<THREE.Group>(null);
    const [rays, setRays] = useState<{
        angle: number;
        color: string;
        spawnTime: number;
        id: number;
    }[]>([]);
    const [startTime] = useState(() => performance.now() / 1000);
    const [blackoutOpacity, setBlackoutOpacity] = useState(0);
    const calledRef = useRef(false);
    const rayId = useRef(0);
    const [progress, setProgress] = useState(0);

    useFrame((state, delta) => {
        const now = performance.now() / 1000;
        const elapsed = now - startTime;

        // Update blackout opacity
        if (elapsed < SHOOT_DURATION) {
            setBlackoutOpacity(elapsed / SHOOT_DURATION);
        } else {
            setBlackoutOpacity(1);
        }

        if (elapsed < SHOOT_DURATION) {
            const t = Math.min(elapsed / SHOOT_DURATION, 1);
            const percentage = Math.floor(t * 100);
            setProgress(percentage);
            // Notify about the overall animation progress
            onProgress?.(t);
            const expectedCount = Math.floor(MAX_RAYS * easeInCubic(t));
            if (rays.length < expectedCount) {
                const newRays: { angle: number; color: string; spawnTime: number; id: number }[] = [];
                for (let i = rays.length; i < expectedCount; i++) {
                    newRays.push({
                        angle: Math.random() * Math.PI * 2,
                        color: getRandomColor(),
                        spawnTime: now,
                        id: rayId.current++,
                    });
                }
                setRays((prev) => [...prev, ...newRays]);
            }
        } else if (!calledRef.current && rays.length === 0) {
            calledRef.current = true;
            onComplete();
        }

        setRays((prev) => prev.filter(ray => now - ray.spawnTime < RAY_ANIMATION_DURATION));
    });

    return (
        <group ref={group}>
            {/* Rays */}
            {rays.map((ray) => {
                const now = performance.now() / 1000;
                const rawProgress = Math.min((now - ray.spawnTime) / RAY_ANIMATION_DURATION, 1);
                // Apply easeInQuad to make rays accelerate as they move
                const progress = easeInQuad(rawProgress);
                const length = RAY_LENGTH * progress;
                const x = Math.cos(ray.angle) * (length / 2 + CENTER_SPHERE_RADIUS);
                const y = Math.sin(ray.angle) * (length / 2 + CENTER_SPHERE_RADIUS);
                const z = progress * BURST_DISTANCE;
                const dir = new THREE.Vector3(x, y, z).normalize();
                const from = new THREE.Vector3(0, 1, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(from, dir);
                return (
                    <mesh key={ray.id} position={[x, y, z]} quaternion={quaternion}>
                        <cylinderGeometry args={[RAY_RADIUS, RAY_RADIUS, length, 24]} />
                        <meshStandardMaterial color={ray.color} />
                    </mesh>
                );
            })}

            {/* Blackout Plane */}
            <mesh position={[0, 0, -0.05]}>
                <planeGeometry args={[2.8, 1.6]} />
                <meshStandardMaterial
                    color={'black'}
                    transparent
                    opacity={blackoutOpacity}
                />
            </mesh>
        </group>
    );
} 