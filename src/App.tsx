import React, { useState, useEffect } from 'react';
import { Atom, Github, ExternalLink } from 'lucide-react';
import PhysicsCanvas from './components/PhysicsCanvas';
import VotingPanel from './components/VotingPanel';
import PromptInput from './components/PromptInput';
import { aiService } from './lib/ai-service';
import type { SimulationResponse, ComparisonResult } from './types';

declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    THREE: any;
    OIMO: any;
  }
}

function App() {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [simulationA, setSimulationA] = useState<SimulationResponse | null>(null);
  const [simulationB, setSimulationB] = useState<SimulationResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({ A: 0, B: 0, tie: 0 });

  // Load external dependencies
  useEffect(() => {
    const loadDependencies = async () => {
      // Load React and ReactDOM globally
      const React = await import('react');
      const ReactDOM = await import('react-dom/client');
      const THREE = await import('three');

      window.React = React;
      window.ReactDOM = ReactDOM;
      window.THREE = THREE;

      // Load Oimo.js
      const script = document.createElement('script');
      script.src = '/build/oimo.min.js';
      script.async = true;
      document.head.appendChild(script);
    };

    loadDependencies();
  }, []);

  const generateSimulations = async (prompt: string) => {
    setCurrentPrompt(prompt);
    setSimulationA(null);
    setSimulationB(null);
    setIsGenerating(true);
    setHasVoted(false);

    try {
      const models: ['gpt-4o', 'gemini-2.0-flash-exp'] = ['gpt-4o', 'gemini-2.0-flash-exp'];
      
      // Start both generations simultaneously
      const [resultA, resultB] = await Promise.all([
        aiService.generateSimulation(prompt, models[0]),
        aiService.generateSimulation(prompt, models[1])
      ]);

      // Randomly assign which model goes to which side to prevent bias
      const randomAssignment = Math.random() < 0.5;
      if (randomAssignment) {
        setSimulationA({ ...resultA, id: 'A' });
        setSimulationB({ ...resultB, id: 'B' });
      } else {
        setSimulationA({ ...resultB, id: 'A' });
        setSimulationB({ ...resultA, id: 'B' });
      }
    } catch (error) {
      console.error('Error generating simulations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVote = (winner: 'A' | 'B' | 'tie') => {
    setVotes(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    setHasVoted(true);
  };

  const resetComparison = () => {
    setCurrentPrompt('');
    setSimulationA(null);
    setSimulationB(null);
    setHasVoted(false);
    setVotes({ A: 0, B: 0, tie: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Atom className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Physics Arena</h1>
                <p className="text-sm text-gray-600">Compare AI-generated 3D physics simulations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">Source</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <PromptInput onSubmit={generateSimulations} isLoading={isGenerating} />
            
            {(simulationA || simulationB) && (
              <VotingPanel
                onVote={handleVote}
                votes={votes}
                hasVoted={hasVoted}
                disabled={isGenerating || (!simulationA || !simulationB)}
              />
            )}

            {currentPrompt && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Prompt:</h3>
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{currentPrompt}</p>
                <button
                  onClick={resetComparison}
                  className="mt-3 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Start new comparison
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Simulations */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <PhysicsCanvas
                  code={simulationA?.code || ''}
                  isLoading={isGenerating}
                  label="Assistant A"
                />
                {simulationA && !isGenerating && (
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Model: {simulationA.model} • Generated at {new Date(simulationA.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
              
              <div>
                <PhysicsCanvas
                  code={simulationB?.code || ''}
                  isLoading={isGenerating}
                  label="Assistant B"
                />
                {simulationB && !isGenerating && (
                  <div className="mt-3 text-xs text-gray-500 text-center">
                    Model: {simulationB.model} • Generated at {new Date(simulationB.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Powered by OpenAI GPT-4 and Google Gemini • Built with Three.js and Oimo.js
            </p>
            <div className="flex items-center justify-center gap-4 mt-2">
              <a
                href="https://threejs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                Three.js <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/lo-th/Oimo.js"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                Oimo.js <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;