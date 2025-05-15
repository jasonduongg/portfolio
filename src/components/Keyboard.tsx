import { useRef, useMemo } from 'react';
import { Group, ShaderMaterial } from 'three';
import { useFrame } from '@react-three/fiber';

interface KeyboardProps {
    position?: [number, number, number];
    lightsOn?: boolean;
}

// Custom shader for RGB breathing effect
const rgbBreathingShader = {
    uniforms: {
        time: { value: 0 },
        lightsOn: { value: true },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform bool lightsOn;
        varying vec2 vUv;
        
        void main() {
            if (lightsOn) {
                // When lights are on, use a simple white color
                gl_FragColor = vec4(0.9, 0.9, 0.9, 1.0);
            } else {
                // RGB breathing effect when lights are off
                float speed = 1.0;
                float intensity = 1.0;
                
                float r = sin(time * speed + 0.0) * intensity + 0.3;
                float g = sin(time * speed + 2.094) * intensity + 0.3;
                float b = sin(time * speed + 4.188) * intensity + 0.3;
                
                float glow = sin(time * speed * 0.5) * 0.2 + 0.2;
                
                vec3 color = vec3(r, g, b) + glow;
                color = max(color, vec3(0.3));
                color = pow(color, vec3(0.8));
                
                gl_FragColor = vec4(color, 1.0);
            }
        }
    `,
};

// Create a unique material for each key
function Key({ position, lightsOn }: { position: [number, number, number], lightsOn: boolean }) {
    const material = useMemo(() => {
        return new ShaderMaterial({
            ...rgbBreathingShader,
            transparent: true,
        });
    }, []);

    useFrame((state) => {
        if (material) {
            material.uniforms.time.value = state.clock.getElapsedTime() * 0.8;
            material.uniforms.lightsOn.value = lightsOn;
        }
    });

    return (
        <mesh position={position}>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <primitive object={material} />
        </mesh>
    );
}

export default function Keyboard({ position = [0, 0, 0], lightsOn = true }: KeyboardProps) {
    const groupRef = useRef<Group>(null);

    return (
        <group ref={groupRef} position={position}>
            {/* Keyboard base */}
            <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[1.2, 0.05, 0.4]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Keyboard keys - represented as a simplified grid */}
            <group position={[0, 0.03, 0]}>
                {/* Top row */}
                {Array.from({ length: 11 }).map((_, i) => (
                    <Key
                        key={`top-${i}`}
                        position={[-0.5 + i * 0.1, 0, -0.15]}
                        lightsOn={lightsOn}
                    />
                ))}

                {/* Middle row */}
                {Array.from({ length: 10 }).map((_, i) => (
                    <Key
                        key={`middle-${i}`}
                        position={[-0.45 + i * 0.1, 0, -0.05]}
                        lightsOn={lightsOn}
                    />
                ))}

                {/* Bottom row */}
                {Array.from({ length: 11 }).map((_, i) => (
                    <Key
                        key={`bottom-${i}`}
                        position={[-0.5 + i * 0.1, 0, 0.05]}
                        lightsOn={lightsOn}
                    />
                ))}
            </group>
        </group>
    );
} 