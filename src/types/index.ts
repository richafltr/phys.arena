export interface SimulationResponse {
  id: string;
  code: string;
  model: string;
  timestamp: number;
  status: 'generating' | 'complete' | 'error';
}

export interface ComparisonResult {
  prompt: string;
  responseA: SimulationResponse;
  responseB: SimulationResponse;
  winner?: 'A' | 'B' | 'tie';
  votes: {
    A: number;
    B: number;
    tie: number;
  };
}

export interface PhysicsSimulation {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  world: any; // Oimo.js world
  animate: () => void;
  cleanup: () => void;
}