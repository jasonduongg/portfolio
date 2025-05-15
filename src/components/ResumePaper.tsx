import { useRef, useState, useEffect } from 'react';
import { type Mesh, Euler, Vector3, MathUtils } from 'three';
import { useLoader, useFrame, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

interface ResumePaperProps {
    position?: [number, number, number];
    isFreeForm?: boolean;
}

export default function ResumePaper({
    position = [-1.2, -0.8, -0.8],
    isFreeForm = false
}: ResumePaperProps) {
    const meshRef = useRef<Mesh>(null);
    const { controls } = useThree();
    const orbitControls = controls as OrbitControlsImpl;
    const [isFocused, setIsFocused] = useState(false);
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
    const originalPosition = useRef(new Vector3(...position));
    const targetPosition = new Vector3(0, -0.5, -0.40); // Position in front of monitor
    const flatRotation = new Euler(-Math.PI / 2, 0, 0);
    const verticalRotation = new Euler(0, 0, 0);
    const texture = useLoader(TextureLoader, '/data/jasonduong_software.jpg');

    // Wait for initial animation to complete (4 seconds)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialAnimationComplete(true);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    useFrame(() => {
        if (!isInitialAnimationComplete || isFreeForm || !meshRef.current) return;

        const lerpFactor = 0.1; // Smooth animation speed
        const targetRot = isFocused ? verticalRotation : flatRotation;
        const targetPos = isFocused ? targetPosition : originalPosition.current;

        // Smoothly move and rotate the paper
        meshRef.current.position.lerp(targetPos, lerpFactor);
        meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, targetRot.x, lerpFactor);
        meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, targetRot.y, lerpFactor);
        meshRef.current.rotation.z = MathUtils.lerp(meshRef.current.rotation.z, targetRot.z, lerpFactor);
    });

    const handleClick = () => {
        if (!isInitialAnimationComplete || isFreeForm) return;
        setIsFocused(!isFocused);
    };

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={flatRotation}
            onClick={handleClick}
            onPointerOver={(e) => {
                if (!isFreeForm && isInitialAnimationComplete) {
                    document.body.style.cursor = 'pointer';
                }
            }}
            onPointerOut={(e) => {
                document.body.style.cursor = 'auto';
            }}
        >
            <planeGeometry args={[0.8, 1.1]} />
            <meshStandardMaterial
                map={texture}
                color="#ffffff"
                emissive="#333333"
                emissiveIntensity={0.1}
                roughness={0.3}
                metalness={0}
            />
        </mesh>
    );
} 