import React from 'react';
import { HelpCircle } from 'lucide-react';

export interface Algorithm {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

interface AlgorithmSelectionProps {
  algorithms: Algorithm[];
  onChange: (id: string, selected: boolean) => void;
}

const AlgorithmSelection: React.FC<AlgorithmSelectionProps> = ({ algorithms, onChange }) => {
  const handleChange = (id: string, checked: boolean) => {
    onChange(id, checked);
  };
  
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Algorithms to Run
      </label>
      
      <div className="space-y-2">
        {algorithms.map((algorithm) => (
          <div key={algorithm.id} className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id={`algorithm-${algorithm.id}`}
                type="checkbox"
                checked={algorithm.selected}
                onChange={(e) => handleChange(algorithm.id, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div className="ml-3 flex items-center">
              <label 
                htmlFor={`algorithm-${algorithm.id}`} 
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                {algorithm.name}
              </label>
              <div className="relative inline-block ml-1 group">
                <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                <div className="absolute z-10 left-1/2 bottom-full mb-2 -translate-x-1/2 w-64 bg-gray-800 text-white text-xs p-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                  {algorithm.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelection;