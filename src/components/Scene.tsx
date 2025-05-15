'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, SpotLight } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three';
import type { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import Monitor from './Monitor';
import Room from './Room';

function CameraAnimation() {
    const cameraRef = useRef<PerspectiveCameraImpl>(null);
    const [startAnimation, setStartAnimation] = useState(true);
    const targetPosition: [number, number, number] = [0, -0.5, 0];
    const startPosition: [number, number, number] = [0, 0, 3]; // Reduced from 5 to 3 for a shorter pan

    useEffect(() => {
        // Reset animation after 4 seconds
        const timer = setTimeout(() => setStartAnimation(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    useFrame(() => {
        if (startAnimation && cameraRef.current) {
            // Slower interpolation for smoother pan
            cameraRef.current.position.x += (targetPosition[0] - cameraRef.current.position.x) * 0.05;
            cameraRef.current.position.y += (targetPosition[1] - cameraRef.current.position.y) * 0.05;
            cameraRef.current.position.z += (targetPosition[2] - cameraRef.current.position.z) * 0.05;
        }
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            position={startPosition}
            fov={110}
        />
    );
}

function FreeFormCamera() {
    const { camera, controls } = useThree();
    const orbitControls = controls as OrbitControlsImpl;

    useEffect(() => {
        if (orbitControls) {
            // Configure OrbitControls
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.05;
            orbitControls.screenSpacePanning = false;
            orbitControls.minDistance = 1;
            orbitControls.maxDistance = 20;
            orbitControls.maxPolarAngle = Math.PI / 2;
            orbitControls.rotateSpeed = 0.5;
        }
    }, [orbitControls]);

    return <OrbitControls makeDefault />;
}

export default function Scene() {
    const [isFreeForm, setIsFreeForm] = useState(false);
    const [lightsOn, setLightsOn] = useState(true);
    const cameraRef = useRef<PerspectiveCameraImpl>(null);

    const handleLightChange = (isOn: boolean) => {
        setLightsOn(isOn);
    };

    const handleViewChange = (newIsFreeForm: boolean) => {
        if (!newIsFreeForm && cameraRef.current) {
            // Reset camera when switching to animated view
            cameraRef.current.position.set(0, 0, 3);
            cameraRef.current.rotation.set(0, 0, 0);
            cameraRef.current.lookAt(0, 0, 0);
        }
        setIsFreeForm(newIsFreeForm);
    };

    return (
        <div className="w-full h-screen relative">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => handleViewChange(!isFreeForm)}
                    className="bg-white/80 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-colors"
                >
                    {isFreeForm ? 'Switch to Animated View' : 'Switch to Free View'}
                </button>
            </div>
            <Canvas shadows>
                {!isFreeForm ? (
                    <>
                        <CameraAnimation />
                        <ambientLight intensity={0.2} />
                        {lightsOn && (
                            <>
                                <ambientLight intensity={1.1} />
                            </>
                        )}
                        <Room onLightChange={handleLightChange} lightsOn={lightsOn} />
                    </>
                ) : (
                    <>
                        <PerspectiveCamera
                            ref={cameraRef}
                            makeDefault
                            position={[0, 0, 3]}
                            fov={75}
                        />
                        <FreeFormCamera />
                        <ambientLight intensity={0.8} />
                        {lightsOn && (
                            <>
                                <pointLight position={[5, 5, 5]} intensity={4.0} castShadow />
                                <pointLight position={[-5, 5, -5]} intensity={3.0} castShadow />
                                <SpotLight
                                    position={[0, 4, 3]}
                                    angle={0.3}
                                    penumbra={0.5}
                                    intensity={8}
                                    castShadow
                                    target-position={[0, 0, 0]}
                                />
                            </>
                        )}
                        <Room onLightChange={handleLightChange} lightsOn={lightsOn} />
                    </>
                )}
            </Canvas>
        </div>
    );
} 