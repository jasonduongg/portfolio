import { useRef, useState, useEffect } from 'react';
import { type Mesh, Euler, Vector3, MathUtils } from 'three';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface ResumePaperProps {
    position?: [number, number, number];
}

export default function ResumePaper({ position = [-1.2, -1.4, -0.8] }: ResumePaperProps) {
    const meshRef = useRef<Mesh>(null);
    const { camera, controls } = useThree();
    const orbitControls = controls as OrbitControlsImpl;
    const [isFocused, setIsFocused] = useState(false);
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
    const originalPosition = useRef(new Vector3(...position));
    const originalTarget = useRef(new Vector3(0, 0, 0));
    const targetPosition = new Vector3(0, 0.1, -0.2);
    const targetCameraPosition = new Vector3(0, 0.1, 0.2);
    const flatRotation = new Euler(-Math.PI / 2, 0, 0);
    const verticalRotation = new Euler(0, 0, 0);
    const texture = useLoader(TextureLoader, '/data/jasonduong_software.jpg');

    // Wait for initial animation to complete (4 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialAnimationComplete(true);
            if (orbitControls) {
                originalTarget.current.copy(orbitControls.target);
            }
        }, 4000);
        return () => clearTimeout(timer);
    }, [orbitControls]);

    useFrame(() => {
        if (!isInitialAnimationComplete || !orbitControls) return;

        if (meshRef.current) {
            // Use different speeds for focusing and returning
            const lerpFactor = isFocused ? 0.1 : 0.05;

            // Smoothly move the paper
            const targetPos = isFocused ? targetPosition : originalPosition.current;
            meshRef.current.position.lerp(targetPos, lerpFactor);

            // Smoothly rotate the paper
            const targetRot = isFocused ? verticalRotation : flatRotation;
            meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, targetRot.x, lerpFactor);
            meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetRot.y, lerpFactor);
            meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, targetRot.z, lerpFactor);

            if (isFocused) {
                // When focused, temporarily disable controls and set camera position
                orbitControls.enabled = false;
                camera.position.lerp(targetCameraPosition, lerpFactor);
                orbitControls.target.set(0, 0.1, -0.2);
            } else {
                // When unfocused, re-enable controls and restore original target
                orbitControls.enabled = true;
                orbitControls.target.lerp(originalTarget.current, lerpFactor);
            }
            orbitControls.update();
        }
    });

    const handleClick = () => {
        if (!isInitialAnimationComplete) return;
        setIsFocused(!isFocused);
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={flatRotation}
            onClick={handleClick}
        >
            <planeGeometry args={[0.8, 1.1]} />
            <meshStandardMaterial
                map={texture}
                color="#ffffff"
                emissive="#333333"
                emissiveIntensity={0.2}
                roughness={0.4}
                metalness={0}
            />
        </mesh>
    );
} 