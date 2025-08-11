import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

const PHYSICS_SYSTEM_PROMPT = `You are an expert Three.js and physics simulation developer. Create interactive 3D physics simulations using React, Three.js, and Oimo.js.

CRITICAL REQUIREMENTS:
- ALWAYS use React functional components with hooks
- ALWAYS use TypeScript with proper typing
- ALWAYS sync Three.js meshes with Oimo.js physics bodies in animation loop
- ALWAYS include proper lighting (ambient + directional)
- ALWAYS add a ground plane for physics interactions
- Keep outputs small, focused, and immediately runnable
- Position any UI controls in bottom-right with glass-morphism styling
- Use Oimo.js for all physics (already available globally)

DEFAULT SETUP PATTERN:
\`\`\`typescript
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const PhysicsSimulation: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 10, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Physics world
    const world = new OIMO.World({ 
      timestep: 1/60,
      iterations: 8,
      broadphase: 2,
      worldscale: 1,
      random: true,
      info: false,
      gravity: [0, -9.8, 0]
    });

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    world.add({ type: 'box', size: [20, 1, 20], pos: [0, -0.5, 0], move: false });

    // Your simulation objects here...

    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const animate = () => {
      world.step();
      // Sync physics bodies with meshes here
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative">
      <div ref={mountRef} />
      {/* UI controls in bottom-right */}
    </div>
  );
};

export default PhysicsSimulation;
\`\`\`

When user requests a simulation, respond ONLY with the complete React component code. Make it engaging and physically accurate!`;

export class AIService {
  private openaiClient = openai({ 
    apiKey: import.meta.env.VITE_OPENAI_API_KEY 
  });
  private googleClient = google({ 
    apiKey: import.meta.env.VITE_GOOGLE_API_KEY 
  });
  
  private models = {
    'gpt-4o': this.openaiClient.chat('gpt-4o'),
    'gemini-2.0-flash-exp': this.googleClient.generativeAI('gemini-2.0-flash-exp')
  };

  async generateSimulation(prompt: string, model: 'gpt-4o' | 'gemini-2.0-flash-exp') {
    try {
      const result = await generateText({
        model: this.models[model],
        system: PHYSICS_SYSTEM_PROMPT,
        prompt: `Create a Three.js physics simulation: ${prompt}`,
        temperature: 0.7,
      });

      return {
        code: result.text,
        model,
        timestamp: Date.now(),
        status: 'complete' as const
      };
    } catch (error) {
      console.error(`Error generating with ${model}:`, error);
      throw error;
    }
  }

  async *streamSimulation(prompt: string, model: 'gpt-4o' | 'gemini-2.0-flash-exp') {
    try {
      const result = await streamText({
        model: this.models[model],
        system: PHYSICS_SYSTEM_PROMPT,
        prompt: `Create a Three.js physics simulation: ${prompt}`,
        temperature: 0.7,
      });

      let code = '';
      for await (const delta of result.textStream) {
        code += delta;
        yield {
          code,
          model,
          timestamp: Date.now(),
          status: 'generating' as const
        };
      }

      yield {
        code,
        model,
        timestamp: Date.now(),
        status: 'complete' as const
      };
    } catch (error) {
      console.error(`Error streaming with ${model}:`, error);
      throw error;
    }
  }
}

export const aiService = new AIService();