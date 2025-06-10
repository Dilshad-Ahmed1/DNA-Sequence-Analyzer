import React from 'react';

interface DNASequenceViewerProps {
  sequence: string;
  pattern: string;
  matches: {
    algorithm: string;
    positions: number[];
    color: string;
  }[];
  showAlgorithm: string | null;
  highlightPosition?: number;
  highlightLength?: number;
}

const DNASequenceViewer: React.FC<DNASequenceViewerProps> = ({ 
  sequence, 
  pattern, 
  matches,
  showAlgorithm,
  highlightPosition,
  highlightLength = 0
}) => {
  if (!sequence) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center text-gray-500">
          Enter a DNA sequence to visualize
        </div>
      </div>
    );
  }
  
  // Get nucleotide color
  const getNucleotideColor = (char: string) => {
    switch (char.toUpperCase()) {
      case 'A': return 'text-green-600';
      case 'T': return 'text-red-600';
      case 'C': return 'text-blue-600';
      case 'G': return 'text-yellow-600';
      case 'N': return 'text-gray-400';
      default: return 'text-gray-800';
    }
  };
  
  // Determine if position is included in match results
  const getMatchInfo = (index: number) => {
    const filteredMatches = showAlgorithm 
      ? matches.filter(m => m.algorithm === showAlgorithm)
      : matches;
    
    return filteredMatches.find(match => {
      return match.positions.some(pos => index >= pos && index < pos + pattern.length);
    });
  };
  
  // Is this character part of the currently highlighted step?
  const isHighlighted = (index: number) => {
    return highlightPosition !== undefined && 
           index >= highlightPosition && 
           index < (highlightPosition + highlightLength);
  };
  
  // Render sequence with highlighting
  const renderSequence = () => {
    return sequence.split('').map((char, index) => {
      const matchInfo = getMatchInfo(index);
      const nucleotideColor = getNucleotideColor(char);
      const highlight = isHighlighted(index);
      
      return (
        <span 
          key={index}
          className={`${nucleotideColor} ${
            matchInfo 
              ? `bg-${matchInfo.color}-100 underline decoration-${matchInfo.color}-500 decoration-2`
              : ''
          } ${
            highlight ? 'bg-blue-200 rounded-sm' : ''
          } font-mono`}
        >
          {char}
        </span>
      );
    });
  };
  
  // Calculate some stats for display
  const stats = matches.map(match => ({
    algorithm: match.algorithm,
    count: match.positions.length
  }));
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">DNA Sequence Viewer</h3>
        <div className="flex space-x-2">
          {stats.map((stat) => (
            <span key={stat.algorithm} className="text-xs px-2 py-1 bg-gray-100 rounded-md">
              {stat.algorithm}: {stat.count} {stat.count === 1 ? 'match' : 'matches'}
            </span>
          ))}
        </div>
      </div>
      
      <div className="border border-gray-200 rounded-md p-3 overflow-auto" style={{ maxHeight: '350px' }}>
        <div className="font-mono text-sm whitespace-pre-wrap">
          {renderSequence()}
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-3">
        <span className="flex items-center text-xs">
          <span className="w-3 h-3 inline-block bg-green-600 rounded-full mr-1"></span> A
        </span>
        <span className="flex items-center text-xs">
          <span className="w-3 h-3 inline-block bg-red-600 rounded-full mr-1"></span> T
        </span>
        <span className="flex items-center text-xs">
          <span className="w-3 h-3 inline-block bg-blue-600 rounded-full mr-1"></span> C
        </span>
        <span className="flex items-center text-xs">
          <span className="w-3 h-3 inline-block bg-yellow-600 rounded-full mr-1"></span> G
        </span>
        <span className="flex items-center text-xs">
          <span className="w-3 h-3 inline-block bg-gray-400 rounded-full mr-1"></span> N
        </span>
      </div>
    </div>
  );
};

export default DNASequenceViewer;