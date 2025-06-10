import React from 'react';
import { getNucleotideColor } from '../algorithms/dnaUtils';
import { AlignmentStats } from '../algorithms/dnaUtils';

interface AlignmentViewerProps {
  alignedSeq1: string;
  alignedSeq2: string;
  stats: AlignmentStats;
}

const AlignmentViewer: React.FC<AlignmentViewerProps> = ({
  alignedSeq1,
  alignedSeq2,
  stats
}) => {
  const renderNucleotide = (nucleotide: string, index: number) => {
    const color = getNucleotideColor(nucleotide);
    const isMatch = alignedSeq1[index] === alignedSeq2[index];
    
    return (
      <span
        key={index}
        style={{
          backgroundColor: color,
          color: '#000',
          padding: '2px 4px',
          margin: '0 1px',
          borderRadius: '2px',
          fontWeight: isMatch ? 'bold' : 'normal',
          display: 'inline-block',
          minWidth: '20px',
          textAlign: 'center'
        }}
      >
        {nucleotide}
      </span>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Alignment Statistics</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>Identity: {stats.identity.toFixed(2)}%</div>
          <div>Similarity: {stats.similarity.toFixed(2)}%</div>
          <div>Gaps: {stats.gaps}</div>
          <div>Gap Percentage: {stats.gapPercentage.toFixed(2)}%</div>
          <div>Length: {stats.length}</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Alignment</h3>
        <div className="font-mono text-sm">
          <div className="mb-1">
            {alignedSeq1.split('').map((n, i) => renderNucleotide(n, i))}
          </div>
          <div className="mb-1">
            {alignedSeq2.split('').map((n, i) => renderNucleotide(n, i))}
          </div>
        </div>
      </div>

      <div className="text-sm">
        <h3 className="text-lg font-semibold mb-2">Legend</h3>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1" style={{ backgroundColor: '#FF0000' }}></span>
            A
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1" style={{ backgroundColor: '#00FF00' }}></span>
            T
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1" style={{ backgroundColor: '#0000FF' }}></span>
            G
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1" style={{ backgroundColor: '#FFFF00' }}></span>
            C
          </div>
          <div className="flex items-center">
            <span className="w-4 h-4 mr-1" style={{ backgroundColor: '#808080' }}></span>
            Gap
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlignmentViewer; 