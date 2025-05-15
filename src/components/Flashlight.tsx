import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SpotLight, Sphere } from '@react-three/drei';
import { Vector3, SpotLight as SpotLightImpl, Object3D, Group, Mesh } from 'three';

interface FlashlightProps {
    enabled: boolean;
}

export default function Flashlight({ enabled }: FlashlightProps) {
    const { camera, size } = useThree();
    const lightRef = useRef<SpotLightImpl>(null);
    const groupRef = useRef<Group>(null);
    const sphereRef = useRef<Mesh>(null);
    const mousePosition = useRef(new Vector3());
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (groupRef.current) {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!enabled || !camera) return;

            // Convert mouse position to normalized device coordinates (-1 to +1)
            const x = (event.clientX / size.width) * 2 - 1;
            const y = -(event.clientY / size.height) * 2 + 1;

            // Convert to world coordinates
            const vector = new Vector3(x, y, 0.5);
            vector.unproject(camera);
            const dir = vector.sub(camera.position).normalize();
            const distance = -camera.position.z / dir.z;
            const pos = camera.position.clone().add(dir.multiplyScalar(distance));

            mousePosition.current.copy(pos);
        };

        if (enabled) {
            window.addEventListener('mousemove', handleMouseMove);
            // Initial position update
            handleMouseMove({ clientX: size.width / 2, clientY: size.height / 2 } as MouseEvent);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [camera, size, enabled]);

    useFrame(() => {
        if (!enabled || !lightRef.current || !groupRef.current || !isInitialized) return;

        // Update light position to be slightly in front of camera
        const cameraDirection = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
        const lightPosition = camera.position.clone().add(cameraDirection.multiplyScalar(0.5));
        lightRef.current.position.copy(lightPosition);

        // Update target position to follow mouse
        if (groupRef.current.children[0]) {
            groupRef.current.children[0].position.copy(mousePosition.current);
        }

        // Update sphere position directly
        if (sphereRef.current) {
            sphereRef.current.position.copy(mousePosition.current);
        }
    });

    if (!enabled || !isInitialized) return null;

    return (
        <group ref={groupRef}>
            <object3D position={[0, 0, 0]} />
            <SpotLight
                ref={lightRef}
                target={groupRef.current.children[0]}
                angle={0.5}
                penumbra={0.2}
                intensity={5}
                distance={15}
                attenuation={2}
                anglePower={2}
                color="#ffffff"
                castShadow
                debug={true}
            />
            <Sphere
                ref={sphereRef}
                args={[0.2, 32, 32]}
                position={mousePosition.current}
            >
                <meshStandardMaterial
                    color="red"
                    emissive="red"
                    emissiveIntensity={1}
                    toneMapped={false}
                />
            </Sphere>
        </group>
    );
} 