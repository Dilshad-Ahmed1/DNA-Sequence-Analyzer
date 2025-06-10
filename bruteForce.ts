/**
 * Brute Force pattern matching algorithm for DNA sequences
 * Checks every possible position in the sequence
 */
export interface MatchResult {
  positions: number[];
  comparisons: number;
  executionTime: number;
}

export interface StepInfo {
  currentIndex: number;
  patternIndex: number;
  isMatch: boolean;
  comparisons: number;
  positions: number[];
}

export const bruteForce = (sequence: string, pattern: string): MatchResult => {
  const startTime = performance.now();
  
  const positions: number[] = [];
  let comparisons = 0;
  
  // If pattern is empty or longer than sequence, return no matches
  if (!pattern || pattern.length > sequence.length) {
    return { positions, comparisons, executionTime: 0 };
  }
  
  // Iterate through the sequence
  for (let i = 0; i <= sequence.length - pattern.length; i++) {
    let isMatch = true;
    
    // Compare each character in the pattern with the sequence
    for (let j = 0; j < pattern.length; j++) {
      comparisons++;
      
      if (sequence[i + j] !== pattern[j]) {
        isMatch = false;
        break;
      }
    }
    
    // If we found a match, add the position to our results
    if (isMatch) {
      positions.push(i);
    }
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    positions,
    comparisons,
    executionTime
  };
};

// For step mode visualization
export const bruteForceStep = (
  sequence: string, 
  pattern: string, 
  currentStep: number
): StepInfo => {
  const maxSteps = (sequence.length - pattern.length + 1) * pattern.length;
  const step = Math.min(currentStep, maxSteps);
  
  // Calculate current position in sequence and pattern
  const seqPos = Math.floor(step / pattern.length);
  const patternPos = step % pattern.length;
  
  // Collect discovered matches up to current step
  const positions: number[] = [];
  let comparisons = 0;
  
  for (let i = 0; i <= seqPos; i++) {
    let isMatch = true;
    
    for (let j = 0; j < pattern.length; j++) {
      comparisons++;
      
      // If we've gone beyond our current step, stop
      if (i === seqPos && j > patternPos) {
        break;
      }
      
      if (sequence[i + j] !== pattern[j]) {
        isMatch = false;
        break;
      }
    }
    
    if (isMatch && (i < seqPos || patternPos === pattern.length - 1)) {
      positions.push(i);
    }
  }
  
  // Current comparison
  const isMatch = seqPos + patternPos < sequence.length && 
                 pattern[patternPos] === sequence[seqPos + patternPos];
  
  return {
    currentIndex: seqPos,
    patternIndex: patternPos,
    isMatch,
    comparisons,
    positions
  };
};