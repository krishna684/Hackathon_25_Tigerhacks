import React from 'react';
import { AgentState } from '../types';
import { LoadingSpinner } from './icons';

interface AgentCardProps {
  agent: AgentState;
}

const statusStyles: { [key in AgentState['status']]: { bg: string; text: string; label: string } } = {
  idle: { bg: 'bg-gray-600', text: 'text-gray-200', label: 'Idle' },
  thinking: { bg: 'bg-yellow-500', text: 'text-yellow-900', label: 'Thinking' },
  refining: { bg: 'bg-purple-500', text: 'text-purple-900', label: 'Refining' },
  calling_tools: { bg: 'bg-indigo-500', text: 'text-indigo-900', label: 'Calling Tools' },
  done: { bg: 'bg-green-500', text: 'text-green-900', label: 'Done' },
  error: { bg: 'bg-red-500', text: 'text-red-900', label: 'Error' },
};

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const style = statusStyles[agent.status];
  const isProcessing = agent.status === 'thinking' || agent.status === 'refining' || agent.status === 'calling_tools';

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 shadow-lg transition-all duration-500 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold text-white">{agent.name}: <span className="font-normal text-gray-300">{agent.role}</span></h3>
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${style.bg} ${style.text}`}>
          {style.label}
        </span>
      </div>
      <div className="flex-grow min-h-[100px] bg-gray-900/70 rounded-md p-3 text-gray-300 text-sm overflow-y-auto">
        {isProcessing && (
          <div className="flex flex-col items-center justify-center h-full">
            <LoadingSpinner className="w-8 h-8 animate-spin text-indigo-400" />
            <p className="mt-2 text-gray-400">{agent.details || 'Processing...'}</p>
          </div>
        )}
        {agent.output && <p className="whitespace-pre-wrap">{agent.output}</p>}
        {agent.status === 'error' && <p className="text-red-400">{agent.output || 'An unknown error occurred.'}</p>}
      </div>
    </div>
  );
};

export default AgentCard;