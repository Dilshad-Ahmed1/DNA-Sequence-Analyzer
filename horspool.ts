/**
 * Horspool pattern matching algorithm for DNA sequences
 * Uses bad character rule to skip portions of the text
 */
import { MatchResult, StepInfo } from './bruteForce';

// Compute the bad character table for the Horspool algorithm
export const computeBadCharTable = (pattern: string): Record<string, number> => {
  const table: Record<string, number> = {};
  const patternLength = pattern.length;
  
  // Default shift is the pattern length
  const defaultShift = patternLength;
  
  // For each character in the pattern except the last one
  for (let i = 0; i < patternLength - 1; i++) {
    // The shift value is the distance from the character to the end of the pattern
    table[pattern[i]] = patternLength - 1 - i;
  }
  
  return table;
};

export const horspool = (sequence: string, pattern: string): MatchResult => {
  const startTime = performance.now();
  
  const positions: number[] = [];
  let comparisons = 0;
  
  // If pattern is empty or longer than sequence, return no matches
  if (!pattern || pattern.length > sequence.length) {
    return { positions, comparisons, executionTime: 0 };
  }
  
  const patternLength = pattern.length;
  const lastPatternIndex = patternLength - 1;
  
  // Compute the bad character table
  const badCharTable = computeBadCharTable(pattern);
  
  // Start matching
  let i = 0;
  while (i <= sequence.length - patternLength) {
    let j = lastPatternIndex;
    
    // Compare pattern with sequence from right to left
    while (j >= 0 && pattern[j] === sequence[i + j]) {
      comparisons++;
      j--;
    }
    
    // If j < 0, we found a match
    if (j < 0) {
      positions.push(i);
      // Shift by 1 to continue search
      i += 1;
    } else {
      comparisons++;
      
      // Shift according to the bad character table
      const badChar = sequence[i + lastPatternIndex];
      const shift = badCharTable[badChar] || patternLength;
      i += shift;
    }
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    positions,
    comparisons,
    executionTime
  };
};

// For step mode visualization of Horspool algorithm
export const horspoolStep = (
  sequence: string, 
  pattern: string, 
  currentStep: number
): StepInfo & { shift: number } => {
  // Compute the bad character table for reference
  const badCharTable = computeBadCharTable(pattern);
  
  const patternLength = pattern.length;
  const lastPatternIndex = patternLength - 1;
  
  // We'll track the algorithm state manually for visualization
  let i = 0; // position in the sequence
  let step = 0;
  let currentComparisons = 0;
  const positions: number[] = [];
  let currentShift = 0;
  let currentPatternIndex = lastPatternIndex;
  let isCurrentMatch = false;
  
  // Run the algorithm up to the current step
  while (step <= currentStep && i <= sequence.length - patternLength) {
    let j = lastPatternIndex;
    let matchFound = true;
    
    // For each character comparison in the current alignment
    while (j >= 0) {
      // If we've reached our target step, record the state
      if (step === currentStep) {
        currentPatternIndex = j;
        isCurrentMatch = pattern[j] === sequence[i + j];
        break;
      }
      
      currentComparisons++;
      step++;
      
      // If mismatch, calculate shift and break
      if (pattern[j] !== sequence[i + j]) {
        matchFound = false;
        
        // Calculate shift for visualization
        const badChar = sequence[i + lastPatternIndex];
        currentShift = badCharTable[badChar] || patternLength;
        break;
      }
      
      j--;
    }
    
    // If we found a match or checked all characters
    if (matchFound && j < 0) {
      positions.push(i);
      currentShift = 1; // After a match, shift by 1
      i += 1;
    } else if (j >= 0 && step < currentStep) {
      // Shift according to the bad character rule
      const badChar = sequence[i + lastPatternIndex];
      const shift = badCharTable[badChar] || patternLength;
      i += shift;
    }
    
    // If we're at the target step, break
    if (step >= currentStep) break;
  }
  
  return {
    currentIndex: i,
    patternIndex: currentPatternIndex,
    isMatch: isCurrentMatch,
    comparisons: currentComparisons,
    positions: positions,
    shift: currentShift
  };
};