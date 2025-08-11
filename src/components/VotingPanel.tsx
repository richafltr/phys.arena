import React from 'react';
import { ThumbsUp, Users, Trophy } from 'lucide-react';

interface VotingPanelProps {
  onVote: (winner: 'A' | 'B' | 'tie') => void;
  votes: { A: number; B: number; tie: number };
  hasVoted: boolean;
  disabled: boolean;
}

const VotingPanel: React.FC<VotingPanelProps> = ({ onVote, votes, hasVoted, disabled }) => {
  const total = votes.A + votes.B + votes.tie;
  const percentA = total > 0 ? Math.round((votes.A / total) * 100) : 0;
  const percentB = total > 0 ? Math.round((votes.B / total) * 100) : 0;
  const percentTie = total > 0 ? Math.round((votes.tie / total) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-800">Which simulation is better?</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => onVote('A')}
          disabled={disabled || hasVoted}
          className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 group-hover:text-blue-600">A</div>
            <div className="text-sm text-gray-600">Assistant A</div>
          </div>
        </button>

        <button
          onClick={() => onVote('tie')}
          disabled={disabled || hasVoted}
          className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 group-hover:text-purple-600">⚖️</div>
            <div className="text-sm text-gray-600">It's a tie</div>
          </div>
        </button>

        <button
          onClick={() => onVote('B')}
          disabled={disabled || hasVoted}
          className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-green-500 hover:bg-green-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 group-hover:text-green-600">B</div>
            <div className="text-sm text-gray-600">Assistant B</div>
          </div>
        </button>
      </div>

      {total > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{total} votes</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Assistant A</span>
              <span className="text-sm font-medium text-blue-600">{percentA}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${percentA}%` }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Assistant B</span>
              <span className="text-sm font-medium text-green-600">{percentB}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentB}%` }}></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Tie</span>
              <span className="text-sm font-medium text-purple-600">{percentTie}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${percentTie}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {hasVoted && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">Thank you for voting!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPanel;