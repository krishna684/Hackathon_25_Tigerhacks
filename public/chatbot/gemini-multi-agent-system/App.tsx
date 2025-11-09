import React, { useState, useCallback } from 'react';
import { AgentState, StructuredData, FinalResponse, AgentName } from './types';
import { geminiService } from './services/geminiService';
import InputForm from './components/InputForm';
import AgentCard from './components/AgentCard';
import ResultDisplay from './components/ResultDisplay';
import { MeteorIcon } from './components/icons';

const initialAgentsState: AgentState[] = [
  { name: 'Agent₁', role: 'Interpreter', status: 'idle', output: null },
  { name: 'Agent₂', role: 'Refiner', status: 'idle', output: null },
  { name: 'Agent₃', role: 'Extractor & Tool User', status: 'idle', output: null },
  { name: 'Agent₄', role: 'Aggregator', status: 'idle', output: null },
];

const App: React.FC = () => {
  const [agents, setAgents] = useState<AgentState[]>(initialAgentsState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [finalResponse, setFinalResponse] = useState<FinalResponse | null>(null);

  const updateAgentState = (name: AgentName, updates: Partial<AgentState>) => {
    setAgents(prev => prev.map(agent => agent.name === name ? { ...agent, ...updates } : agent));
  };
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGenerate = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setAgents(initialAgentsState);
    setFinalResponse(null);

    try {
      // Agent 1: Interpretation
      updateAgentState('Agent₁', { status: 'thinking', details: 'Interpreting request...' });
      const interpretation = await geminiService.interpretRequest(prompt);
      updateAgentState('Agent₁', { status: 'done', output: interpretation });
      await sleep(500);

      // Agent 2 & 3: Reasoning Loop
      let currentContext = interpretation;
      let structuredData: StructuredData | null = null;
      for (let i = 1; i <= 3; i++) {
        updateAgentState('Agent₂', { status: 'refining', details: `Reasoning Loop ${i}/3...` });
        updateAgentState('Agent₃', { status: 'refining', details: `Reasoning Loop ${i}/3...` });
        
        structuredData = await geminiService.reasonAndStructure(currentContext, i);
        currentContext = structuredData.text; // Use refined text for next loop
        
        const loopOutput = `Loop ${i} Output:\n` + JSON.stringify(structuredData, null, 2);
        updateAgentState('Agent₂', { output: loopOutput });
        updateAgentState('Agent₃', { output: loopOutput });
        
        await sleep(500);
      }
      
      if (!structuredData) throw new Error("Reasoning loop failed to produce data.");

      updateAgentState('Agent₂', { status: 'done', details: 'Refinement complete.' });
      updateAgentState('Agent₃', { status: 'calling_tools', details: 'Extracting keywords & calling tools...' });
      await sleep(1000); // Simulate tool call delay
      
      const finalStructuredData = structuredData;
      updateAgentState('Agent₃', { status: 'done', output: `Tools called with keywords:\n- Image: "${finalStructuredData.image}"\n- News: "${finalStructuredData.news}"\n- Paper: "${finalStructuredData.paper}"\n- Video: "${finalStructuredData.video}"` });
      await sleep(500);

      // Agent 4: Aggregation - Simulate a space-themed response
      updateAgentState('Agent₄', { status: 'thinking', details: 'Synthesizing cosmic data...' });
      await sleep(1000); // Simulate aggregation
      
      const simulatedResponse: FinalResponse = {
        text: `Based on your query, we've synthesized information on Carbonaceous Chondrites. These primitive meteorites are crucial for understanding the early solar system. They contain organic compounds and water, suggesting they may have delivered the building blocks of life to Earth. Their composition closely matches the sun's photosphere, minus the volatile gases.`,
        imageUrl: `https://picsum.photos/seed/${encodeURIComponent(finalStructuredData.image || 'nebula')}/500/500`,
        news: [
          { title: `Astronomers Detect Water Vapor on Exoplanet K2-18b`, url: '#' },
          { title: `NASA's DART Mission Successfully Alters Asteroid's Orbit`, url: '#' }
        ],
        papers: [
          { title: `The Isotopic Composition of Carbonaceous Chondrites`, url: '#' },
          { title: `Organic Matter in Meteorites and the Origin of Life`, url: '#' }
        ],
        videos: [
          { title: `What If a Meteorite Hit Your House?`, url: '#' },
          { title: `Journey to the Asteroid Belt`, url: '#' }
        ],
      };

      setFinalResponse(simulatedResponse);
      updateAgentState('Agent₄', { status: 'done', output: 'Cosmic data synthesis complete. Response rendered.' });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      console.error("Workflow failed:", error);
      // Find which agent was processing and set its state to error
      const processingAgent = agents.find(a => ['thinking', 'refining', 'calling_tools'].includes(a.status));
      if(processingAgent) {
        updateAgentState(processingAgent.name, { status: 'error', output: errorMessage });
      } else {
        // Fallback if no specific agent was active
        updateAgentState('Agent₁', { status: 'error', output: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  }, [agents]); // agents dependency to get latest state for error handling

  return (
    <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
      <style>{`
        body { 
          font-family: 'Exo 2', sans-serif;
        }
        .animate-fade-in { animation: fadeIn 0.8s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4">
            <MeteorIcon className="w-12 h-12 text-indigo-400"/>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Gemini Interstellar Query
            </h1>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">
            An AI-driven multi-agent system designed to explore the cosmos and deliver synthesized, multimodal data from the depths of space.
          </p>
        </header>

        <main>
          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 animate-fade-in">
            {agents.map((agent) => (
              <AgentCard key={agent.name} agent={agent} />
            ))}
          </div>

          {finalResponse && <ResultDisplay response={finalResponse} />}
        </main>
      </div>
    </div>
  );
};

export default App;