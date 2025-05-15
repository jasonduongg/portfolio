import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NUM_RAYS = 12;
const RAY_LENGTH = 1.2;
const RAY_RADIUS = 0.06;
const SPHERE_RADIUS = 0.12;
const CENTER_SPHERE_RADIUS = 0.22;
const BURST_DISTANCE = 1.2; // How far rays fly toward the camera (z)

// Generate a color palette (HSL for variety)
const COLORS = Array.from({ length: NUM_RAYS }, (_, i) => `hsl(${(i * 360) / NUM_RAYS}, 90%, 55%)`);

export function ColorBurst({ onComplete }: { onComplete: () => void }) {
    const group = useRef<THREE.Group>(null);
    const [progress, setProgress] = useState(0);
    const calledRef = useRef(false);

    useFrame((_, delta) => {
        setProgress((p) => {
            const next = Math.min(p + delta * 2, 1); // 0 to 1 in 0.5s
            if (next === 1 && onComplete && !calledRef.current) {
                calledRef.current = true;
                onComplete();
            }
            return next;
        });
    });

    return (
        <group ref={group}>
            {/* Central Sphere */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[CENTER_SPHERE_RADIUS, 32, 32]} />
                <meshStandardMaterial color={'#fff'} />
            </mesh>

            {/* Rays */}
            {Array.from({ length: NUM_RAYS }).map((_, i) => {
                const angle = (i / NUM_RAYS) * Math.PI * 2;
                // Animate the ray's length and position
                const length = RAY_LENGTH * progress;
                // Position: move outward from center
                const x = Math.cos(angle) * (length / 2 + CENTER_SPHERE_RADIUS);
                const y = Math.sin(angle) * (length / 2 + CENTER_SPHERE_RADIUS);
                const z = progress * BURST_DISTANCE;
                // Direction vector from center to current position
                const dir = new THREE.Vector3(x, y, z).normalize();
                // Default cylinder in Three.js points up the Y axis, so rotate from (0,1,0) to dir
                const from = new THREE.Vector3(0, 1, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(from, dir);
                // End sphere position
                const endX = Math.cos(angle) * (length + CENTER_SPHERE_RADIUS);
                const endY = Math.sin(angle) * (length + CENTER_SPHERE_RADIUS);
                const endZ = progress * BURST_DISTANCE;
                return (
                    <group key={i}>
                        {/* Cylinder Ray */}
                        <mesh position={[x, y, z]} quaternion={quaternion}>
                            <cylinderGeometry args={[RAY_RADIUS, RAY_RADIUS, length, 24]} />
                            <meshStandardMaterial color={COLORS[i]} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
} 