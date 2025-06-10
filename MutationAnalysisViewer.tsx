import React from 'react';
import { Mutation, MutationAnalysisResult } from '../algorithms/mutationAnalysis';

interface MutationAnalysisViewerProps {
  result: MutationAnalysisResult;
}

export const MutationAnalysisViewer: React.FC<MutationAnalysisViewerProps> = ({ result }) => {
  const { mutations, mutationRate, impactSummary } = result;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Mutation Analysis Results</h3>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-600">Total Mutations</h4>
          <p className="text-2xl font-bold text-blue-700">{mutations.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-600">Mutation Rate</h4>
          <p className="text-2xl font-bold text-green-700">{(mutationRate * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-600">High Impact Mutations</h4>
          <p className="text-2xl font-bold text-purple-700">{impactSummary.high}</p>
        </div>
      </div>

      {/* Impact Distribution */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">Impact Distribution</h4>
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div 
              className="bg-red-500" 
              style={{ width: `${(impactSummary.high / mutations.length) * 100}%` }}
            />
            <div 
              className="bg-yellow-500" 
              style={{ width: `${(impactSummary.medium / mutations.length) * 100}%` }}
            />
            <div 
              className="bg-green-500" 
              style={{ width: `${(impactSummary.low / mutations.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>High Impact: {impactSummary.high}</span>
          <span>Medium Impact: {impactSummary.medium}</span>
          <span>Low Impact: {impactSummary.low}</span>
        </div>
      </div>

      {/* Mutations List */}
      <div>
        <h4 className="text-lg font-medium mb-2">Detailed Mutations</h4>
        <div className="space-y-2">
          {mutations.map((mutation, index) => (
            <div 
              key={index}
              className={`p-3 rounded-lg ${
                mutation.impact === 'high' ? 'bg-red-50' :
                mutation.impact === 'medium' ? 'bg-yellow-50' :
                'bg-green-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium">{mutation.type.charAt(0).toUpperCase() + mutation.type.slice(1)}</span>
                  <span className="text-gray-600 ml-2">at position {mutation.position}</span>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  mutation.impact === 'high' ? 'bg-red-100 text-red-800' :
                  mutation.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {mutation.impact} impact
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <span className="font-mono">{mutation.original}</span>
                <span className="mx-2">→</span>
                <span className="font-mono">{mutation.mutated}</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">{mutation.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 