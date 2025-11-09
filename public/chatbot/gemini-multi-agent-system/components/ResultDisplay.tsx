import React from 'react';
import { FinalResponse } from '../types';
import { NewsIcon, PaperIcon, VideoIcon } from './icons';

interface ResultDisplayProps {
  response: FinalResponse | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ response }) => {
  if (!response) {
    return null;
  }

  const renderLinkList = (items: { title: string; url: string }[], Icon: React.FC<{ className?: string }>) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <Icon className="w-5 h-5 mr-3 mt-1 text-indigo-400 flex-shrink-0" />
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-indigo-300 hover:underline hover:text-indigo-200 transition-colors">
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-8 w-full max-w-4xl mx-auto bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Aggregated Response</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <p className="text-gray-300 leading-relaxed">{response.text}</p>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">News Articles</h4>
                {renderLinkList(response.news, NewsIcon)}
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Research Papers</h4>
                {renderLinkList(response.papers, PaperIcon)}
              </div>
              <div className="lg:col-span-2">
                <h4 className="text-lg font-semibold text-white mb-3">Videos</h4>
                {renderLinkList(response.videos, VideoIcon)}
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <img 
              src={response.imageUrl} 
              alt="Generated visual representation" 
              className="w-full h-auto object-cover rounded-lg shadow-md border-2 border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;