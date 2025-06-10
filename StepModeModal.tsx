import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { bruteForceStep } from '../algorithms/bruteForce';
import { horspoolStep } from '../algorithms/horspool';
import { boyerMooreStep } from '../algorithms/boyerMoore';

interface StepModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  sequence: string;
  pattern: string;
  algorithm: string;
  onHighlight: (position: number, length: number) => void;
}

interface StepState {
  currentStep: number;
  maxSteps: number;
  stepInfo: any;
}

const StepModeModal: React.FC<StepModeModalProps> = ({
  isOpen,
  onClose,
  sequence,
  pattern,
  algorithm,
  onHighlight
}) => {
  // Move function declarations before the useState and useEffect hooks
  const estimateMaxSteps = () => {
    // Rough estimate based on algorithm and input sizes
    const seqLength = sequence.length;
    const patLength = pattern.length;
    
    switch (algorithm) {
      case 'Brute-Force':
        return seqLength * patLength;
      case 'Horspool':
      case 'Boyer-Moore':
        return seqLength; // These can skip characters, so fewer steps
      default:
        return 100;
    }
  };
  
  const runStepFunction = (step: number) => {
    switch (algorithm) {
      case 'Brute-Force':
        return bruteForceStep(sequence, pattern, step);
      case 'Horspool':
        return horspoolStep(sequence, pattern, step);
      case 'Boyer-Moore':
        return boyerMooreStep(sequence, pattern, step);
      default:
        return {};
    }
  };

  const [stepState, setStepState] = useState<StepState>({
    currentStep: 0,
    maxSteps: 100, // Initial estimate, will be refined
    stepInfo: {}
  });
  
  // Reset when algorithm or inputs change
  useEffect(() => {
    setStepState({
      currentStep: 0,
      maxSteps: estimateMaxSteps(),
      stepInfo: runStepFunction(0)
    });
  }, [algorithm, sequence, pattern]);
  
  // Update highlighting when step changes
  useEffect(() => {
    if (stepState.stepInfo) {
      const position = stepState.stepInfo.currentIndex;
      let length = 0;
      
      if (algorithm === 'Brute-Force') {
        length = pattern.length;
      } else {
        // For Horspool and Boyer-Moore, highlight from current position to the right end of pattern
        length = pattern.length;
      }
      
      onHighlight(position, length);
    }
  }, [stepState]);
  
  if (!isOpen) return null;
  
  const handleNextStep = () => {
    if (stepState.currentStep < stepState.maxSteps) {
      const nextStep = stepState.currentStep + 1;
      const stepInfo = runStepFunction(nextStep);
      
      setStepState({
        currentStep: nextStep,
        maxSteps: stepState.maxSteps,
        stepInfo
      });
    }
  };
  
  const handlePreviousStep = () => {
    if (stepState.currentStep > 0) {
      const prevStep = stepState.currentStep - 1;
      const stepInfo = runStepFunction(prevStep);
      
      setStepState({
        currentStep: prevStep,
        maxSteps: stepState.maxSteps,
        stepInfo
      });
    }
  };
  
  // For visualizing Boyer-Moore and Horspool tables
  const renderShiftTable = () => {
    if (algorithm === 'Brute-Force' || !pattern) return null;
    
    // Show pseudo shift table information based on the current step
    return (
      <div className="mt-4 border rounded-md p-3 bg-gray-50">
        <h4 className="text-sm font-medium mb-2">
          {algorithm === 'Horspool' ? 'Bad Character Table' : 'Shift Tables'}
        </h4>
        
        {algorithm === 'Horspool' && stepState.stepInfo.shift && (
          <p className="text-sm">
            Current shift: {stepState.stepInfo.shift} position{stepState.stepInfo.shift !== 1 ? 's' : ''}
          </p>
        )}
        
        {algorithm === 'Boyer-Moore' && stepState.stepInfo.shift && (
          <div className="text-sm">
            <p>Current shift: {stepState.stepInfo.shift} position{stepState.stepInfo.shift !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-500 mt-1">Reason: {stepState.stepInfo.shiftReason}</p>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">{algorithm} Step-by-Step Visualization</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Step {stepState.currentStep + 1}</span>
              <span className="text-xs text-gray-500">
                Comparisons: {stepState.stepInfo.comparisons}
              </span>
            </div>
            
            <div className="border rounded-md p-3 font-mono text-sm bg-gray-50 whitespace-pre">
              <div className="mb-2">
                Sequence:
                <br />
                <span className="block overflow-x-auto">
                  {sequence.substring(
                    Math.max(0, stepState.stepInfo.currentIndex - 10),
                    Math.min(sequence.length, stepState.stepInfo.currentIndex + pattern.length + 10)
                  )}
                </span>
              </div>
              
              <div>
                Current alignment:
                <br />
                <span className="block overflow-x-auto">
                  {' '.repeat(Math.min(10, stepState.stepInfo.currentIndex))}
                  {pattern}
                </span>
              </div>
            </div>
            
            <div className="mt-3 text-sm">
              <p>
                <span className="font-medium">Current position:</span> {stepState.stepInfo.currentIndex}
              </p>
              <p>
                <span className="font-medium">Comparing:</span> Pattern[{stepState.stepInfo.patternIndex}] 
                {stepState.stepInfo.patternIndex >= 0 && pattern[stepState.stepInfo.patternIndex]} with 
                Sequence[{stepState.stepInfo.currentIndex + stepState.stepInfo.patternIndex}] 
                {sequence[stepState.stepInfo.currentIndex + stepState.stepInfo.patternIndex]}
              </p>
              <p>
                <span className="font-medium">Matches so far:</span> {stepState.stepInfo.positions?.length || 0}
              </p>
            </div>
            
            {renderShiftTable()}
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-between">
          <button
            onClick={handlePreviousStep}
            disabled={stepState.currentStep === 0}
            className={`px-4 py-2 rounded-md flex items-center ${
              stepState.currentStep === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </button>
          
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Exit Step Mode
          </button>
          
          <button
            onClick={handleNextStep}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepModeModal;