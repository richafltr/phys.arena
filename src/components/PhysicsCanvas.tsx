import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';

interface PhysicsCanvasProps {
  code: string;
  isLoading: boolean;
  label: string;
}

declare global {
  interface Window {
    OIMO: any;
  }
}

const PhysicsCanvas: React.FC<PhysicsCanvasProps> = ({ code, isLoading, label }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const simulationRef = useRef<any>(null);

  const executeSimulation = () => {
    if (!containerRef.current || !code.includes('PhysicsSimulation')) {
      return;
    }

    try {
      // Clear previous simulation
      if (simulationRef.current) {
        simulationRef.current.cleanup?.();
      }
      containerRef.current.innerHTML = '';

      // Create a sandbox for the simulation
      const sandboxCode = `
        ${code}
        
        // Mount the component
        const container = document.createElement('div');
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(PhysicsSimulation));
        return container;
      `;

      const simulationContainer = eval(`(() => {
        const React = window.React;
        const ReactDOM = window.ReactDOM;
        const THREE = window.THREE;
        const OIMO = window.OIMO;
        ${sandboxCode}
      })()`);

      if (simulationContainer && containerRef.current) {
        containerRef.current.appendChild(simulationContainer);
        simulationRef.current = { cleanup: () => simulationContainer.remove() };
        setError(null);
      }
    } catch (err) {
      setError(`Simulation Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Simulation execution error:', err);
    }
  };

  const resetSimulation = () => {
    executeSimulation();
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // This would need to be implemented in the simulation code
  };

  useEffect(() => {
    if (code && !isLoading) {
      const timer = setTimeout(executeSimulation, 100);
      return () => clearTimeout(timer);
    }
  }, [code, isLoading]);

  useEffect(() => {
    return () => {
      if (simulationRef.current) {
        simulationRef.current.cleanup?.();
      }
    };
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Generating...
            </div>
          )}
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative h-96 flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Generating physics simulation...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
            <div className="text-sm text-red-600 max-w-xs">{error}</div>
          </div>
        ) : !code ? (
          <div className="text-gray-400">No simulation generated yet</div>
        ) : null}
        
        <div ref={containerRef} className="w-full h-full flex items-center justify-center" />
      </div>

      {/* Controls */}
      {code && !isLoading && !error && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={togglePlayPause}
            className="p-2 bg-white/90 hover:bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={resetSimulation}
            className="p-2 bg-white/90 hover:bg-white/95 backdrop-blur-sm rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhysicsCanvas;