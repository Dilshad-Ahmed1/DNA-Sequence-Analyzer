import React from 'react';
import { saveAs } from 'file-saver';
import { Download } from 'lucide-react';

export interface AlgorithmResult {
  algorithm: string;
  pattern: string;
  matches: number[];
  comparisons: number;
  executionTime: number;
}

interface ResultsTableProps {
  results: AlgorithmResult[];
  onAlgorithmClick?: (algorithm: string) => void;
  selectedAlgorithm?: string;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ 
  results,
  onAlgorithmClick,
  selectedAlgorithm 
}) => {
  const handleExportCSV = () => {
    // Create CSV content
    const headers = ['Algorithm', 'Pattern', 'Matches', 'Comparisons', 'Time (ms)'];
    const rows = results.map(result => [
      result.algorithm,
      result.pattern,
      result.matches.length > 0 ? result.matches.join(', ') : 'No matches',
      result.comparisons,
      result.executionTime.toFixed(3)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'dna_analysis_results.csv');
  };
  
  if (results.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          Run the analysis to see results
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Results</h3>
        
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-1" />
          Download CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Algorithm
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pattern
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matches
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comparisons
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time (ms)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.map((result, index) => (
              <tr
                key={index}
                onClick={() => onAlgorithmClick?.(result.algorithm)}
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedAlgorithm === result.algorithm ? 'bg-blue-50' : ''
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {result.algorithm}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.pattern}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.matches.length > 0 ? result.matches.join(', ') : 'No matches'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.comparisons}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {result.executionTime.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsTable;