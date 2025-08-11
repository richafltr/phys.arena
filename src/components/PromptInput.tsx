import React, { useState } from 'react';
import { Send, Zap } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
    }
  };

  const examplePrompts = [
    "Create a ragdoll simulation with gravity",
    "Build a pendulum system with multiple connected spheres",
    "Make a bouncing ball simulation with realistic physics",
    "Create a tower of boxes that can be knocked over",
    "Build a particle system with collision detection"
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-800">Create Physics Simulation</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the physics simulation you want to create..."
          className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          disabled={isLoading}
        />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            {prompt.length}/500
          </span>
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
          >
            <Send className="w-4 h-4" />
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>

      <div className="mt-6">
        <p className="text-sm text-gray-600 mb-3">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              disabled={isLoading}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-full transition-colors duration-200"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;