'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, SpotLight } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { PerspectiveCamera as PerspectiveCameraImpl } from 'three';
import { Vector3 } from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import Monitor from './Monitor';
import Room from './Room';
import ResumePaper from './ResumePaper';
import Flashlight from './Flashlight';

function CameraAnimation() {
    const cameraRef = useRef<PerspectiveCameraImpl>(null);
    const [startAnimation, setStartAnimation] = useState(true);
    const targetPosition: [number, number, number] = [0, -0.5, 0];
    const startPosition: [number, number, number] = [0, 0, 3]; // Reduced from 5 to 3 for a shorter pan

    useEffect(() => {
        // Reset animation after 1 second
        const timer = setTimeout(() => setStartAnimation(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    useFrame(() => {
        if (startAnimation && cameraRef.current) {
            // Smoother interpolation with easing
            cameraRef.current.position.x += (targetPosition[0] - cameraRef.current.position.x) * 0.04;
            cameraRef.current.position.y += (targetPosition[1] - cameraRef.current.position.y) * 0.08;
            cameraRef.current.position.z += (targetPosition[2] - cameraRef.current.position.z) * 0.08;
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
    const controlsRef = useRef<OrbitControlsImpl | null>(null);
    const rotationCount = useRef(0);
    const lastRotationTime = useRef(Date.now());
    const moveSpeed = 0.1;
    const keysPressed = useRef(new Set<string>());

    useEffect(() => {
        if (!controlsRef.current) return;

        // Configure OrbitControls with more restrictive settings
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.1;
        controlsRef.current.screenSpacePanning = false;
        controlsRef.current.minDistance = 1;
        controlsRef.current.maxDistance = 20;
        controlsRef.current.maxPolarAngle = Math.PI / 2;
        controlsRef.current.minPolarAngle = 0;
        controlsRef.current.rotateSpeed = 0.3;
        controlsRef.current.enableRotate = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.autoRotate = false;
        controlsRef.current.autoRotateSpeed = 0;

        // Reset camera and controls when component mounts
        resetCamera();

        // Add keyboard shortcut to reset camera (R key)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'r') {
                resetCamera();
            }
            keysPressed.current.add(e.key.toLowerCase());
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed.current.delete(e.key.toLowerCase());
        };

        // Add mouse event listeners to track rotation
        const handleMouseDown = () => {
            rotationCount.current = 0;
            lastRotationTime.current = Date.now();
        };

        const handleMouseMove = () => {
            const now = Date.now();
            if (now - lastRotationTime.current > 100) {
                rotationCount.current = 0;
            }
            lastRotationTime.current = now;
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        document.addEventListener('mousedown', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            document.removeEventListener('mousedown', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }
        };
    }, []);

    const resetCamera = () => {
        if (!controlsRef.current || !camera) return;

        // Reset camera position and rotation
        camera.position.set(0, 0, 3);
        camera.rotation.set(0, 0, 0);
        camera.lookAt(0, 0, 0);

        // Reset controls
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
        rotationCount.current = 0;

        // Force update to ensure smooth transition
        controlsRef.current.enableDamping = false;
        setTimeout(() => {
            if (controlsRef.current) {
                controlsRef.current.enableDamping = true;
            }
        }, 100);
    };

    useFrame(() => {
        if (!controlsRef.current || !camera) return;

        // Update controls
        controlsRef.current.update();

        // Handle WASD movement
        const moveVector = new Vector3();
        const cameraDirection = new Vector3();
        camera.getWorldDirection(cameraDirection);
        const cameraRight = new Vector3().crossVectors(cameraDirection, new Vector3(0, 1, 0)).normalize();

        if (keysPressed.current.has('w')) {
            moveVector.add(cameraDirection);
        }
        if (keysPressed.current.has('s')) {
            moveVector.sub(cameraDirection);
        }
        if (keysPressed.current.has('a')) {
            moveVector.sub(cameraRight);
        }
        if (keysPressed.current.has('d')) {
            moveVector.add(cameraRight);
        }
        // Add vertical movement
        if (keysPressed.current.has(' ')) { // Space
            moveVector.add(new Vector3(0, 1, 0));
        }
        if (keysPressed.current.has('shift')) {
            moveVector.add(new Vector3(0, -1, 0));
        }

        if (moveVector.length() > 0) {
            moveVector.normalize().multiplyScalar(moveSpeed);
            camera.position.add(moveVector);
            controlsRef.current.target.add(moveVector);
        }

        // Check if camera is stuck
        if (controlsRef.current.enableRotate) {
            const now = Date.now();
            if (now - lastRotationTime.current > 500) {
                rotationCount.current = 0;
            }
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            makeDefault
            target={[0, 0, 0]}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
        />
    );
}

export default function Scene() {
    const [isFreeForm, setIsFreeForm] = useState(false);
    const [lightsOn, setLightsOn] = useState(true);
    const cameraRef = useRef<PerspectiveCameraImpl>(null);
    const [key, setKey] = useState(0);

    const handleLightChange = (isOn: boolean) => {
        setLightsOn(isOn);
    };

    const handleViewChange = (newIsFreeForm: boolean) => {
        if (!newIsFreeForm && cameraRef.current) {
            // Reset camera when switching to animated view
            cameraRef.current.position.set(0, 0, 3);
            cameraRef.current.rotation.set(0, 0, 0);
            cameraRef.current.lookAt(0, 0, 0);
        } else if (newIsFreeForm) {
            // Force remount of FreeFormCamera when switching to free view
            setKey(prev => prev + 1);
        }
        setIsFreeForm(newIsFreeForm);
    };

    return (
        <div className="w-full h-screen relative">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                    onClick={() => handleViewChange(!isFreeForm)}
                    className="bg-white/80 hover:bg-white px-4 py-2 rounded-lg shadow-lg transition-colors text-black"
                >
                    {isFreeForm ? 'Switch to Animated View' : 'Switch to Free View'}
                </button>
            </div>
            {isFreeForm && (
                <div className="absolute top-4 left-4 z-10 bg-white/80 p-4 rounded-lg shadow-lg text-black">
                    <h3 className="font-semibold mb-2">Controls</h3>
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">W</kbd>
                            <span>Move Forward</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">S</kbd>
                            <span>Move Backward</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">A</kbd>
                            <span>Move Left</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">D</kbd>
                            <span>Move Right</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd>
                            <span>Move Up</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">Shift</kbd>
                            <span>Move Down</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">R</kbd>
                            <span>Reset Camera</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-gray-200 rounded">Mouse</kbd>
                            <span>Look Around</span>
                        </div>
                    </div>
                </div>
            )}
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
                        <Room onLightChange={handleLightChange} lightsOn={lightsOn} isFreeForm={isFreeForm} />
                        <Flashlight enabled={!lightsOn} />
                    </>
                ) : (
                    <>
                        <PerspectiveCamera
                            ref={cameraRef}
                            makeDefault
                            position={[0, 0, 3]}
                            fov={75}
                        />
                        <FreeFormCamera key={key} />
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
                        <Room onLightChange={handleLightChange} lightsOn={lightsOn} isFreeForm={isFreeForm} />
                        <Flashlight enabled={!lightsOn} />
                    </>
                )}
            </Canvas>
        </div>
    );
} 