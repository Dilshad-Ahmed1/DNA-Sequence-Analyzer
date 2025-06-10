/**
 * Boyer-Moore pattern matching algorithm for DNA sequences
 * Uses both bad character and good suffix rules for efficient matching
 */
import { MatchResult, StepInfo } from './bruteForce';

// Compute the bad character table
export const computeBadCharTable = (pattern: string): number[] => {
  const table: number[] = Array(256).fill(-1);
  
  for (let i = 0; i < pattern.length; i++) {
    table[pattern.charCodeAt(i)] = i;
  }
  
  return table;
};

// Compute the good suffix table
export const computeGoodSuffixTable = (pattern: string): number[] => {
  const m = pattern.length;
  const suffix = Array(m).fill(0);
  const shift = Array(m).fill(0);
  
  // Compute the suffix array
  let f = 0, g = m - 1;
  
  for (let i = m - 2; i >= 0; i--) {
    if (i > g && suffix[i + m - 1 - f] < i - g) {
      suffix[i] = suffix[i + m - 1 - f];
    } else {
      if (i < g) g = i;
      f = i;
      while (g >= 0 && pattern[g] === pattern[g + m - 1 - f]) {
        g--;
      }
      suffix[i] = f - g;
    }
  }
  
  // Compute the shift array
  for (let i = 0; i < m; i++) {
    shift[i] = m;
  }
  
  for (let i = m - 1; i >= 0; i--) {
    if (suffix[i] === i + 1) {
      for (let j = 0; j < m - 1 - i; j++) {
        if (shift[j] === m) {
          shift[j] = m - 1 - i;
        }
      }
    }
  }
  
  for (let i = 0; i <= m - 2; i++) {
    shift[m - 1 - suffix[i]] = m - 1 - i;
  }
  
  return shift;
};

export const boyerMoore = (sequence: string, pattern: string): MatchResult => {
  const startTime = performance.now();
  
  const positions: number[] = [];
  let comparisons = 0;
  
  // If pattern is empty or longer than sequence, return no matches
  if (!pattern || pattern.length > sequence.length) {
    return { positions, comparisons, executionTime: 0 };
  }
  
  const m = pattern.length;
  const n = sequence.length;
  
  // Preprocess
  const badCharTable = computeBadCharTable(pattern);
  const goodSuffixTable = computeGoodSuffixTable(pattern);
  
  let i = 0;
  while (i <= n - m) {
    let j = m - 1;
    
    // Match from right to left
    while (j >= 0 && pattern[j] === sequence[i + j]) {
      comparisons++;
      j--;
    }
    
    // If we matched the entire pattern
    if (j < 0) {
      positions.push(i);
      // Shift to continue search
      i += goodSuffixTable[0];
    } else {
      comparisons++;
      
      // Calculate shifts using both rules and take the maximum
      const badCharShift = Math.max(1, j - badCharTable[sequence.charCodeAt(i + j)]);
      const goodSuffixShift = goodSuffixTable[j];
      i += Math.max(badCharShift, goodSuffixShift);
    }
  }
  
  const executionTime = performance.now() - startTime;
  
  return {
    positions,
    comparisons,
    executionTime
  };
};

// For step mode visualization of Boyer-Moore algorithm
export const boyerMooreStep = (
  sequence: string, 
  pattern: string, 
  currentStep: number
): StepInfo & { shift: number; shiftReason: string } => {
  // Precompute tables
  const badCharTable = computeBadCharTable(pattern);
  const goodSuffixTable = computeGoodSuffixTable(pattern);
  
  const m = pattern.length;
  const n = sequence.length;
  
  // We'll track the algorithm state manually for visualization
  let i = 0; // position in the sequence
  let step = 0;
  let currentComparisons = 0;
  const positions: number[] = [];
  let currentShift = 0;
  let currentPatternIndex = m - 1;
  let isCurrentMatch = false;
  let shiftReason = "";
  
  // Run the algorithm up to the current step
  while (step <= currentStep && i <= n - m) {
    let j = m - 1;
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
        
        // Calculate shifts for visualization
        const badCharShift = Math.max(1, j - badCharTable[sequence.charCodeAt(i + j)]);
        const goodSuffixShift = goodSuffixTable[j];
        
        if (badCharShift >= goodSuffixShift) {
          currentShift = badCharShift;
          shiftReason = "Bad Character Rule";
        } else {
          currentShift = goodSuffixShift;
          shiftReason = "Good Suffix Rule";
        }
        break;
      }
      
      j--;
    }
    
    // If we found a match or checked all characters
    if (matchFound && j < 0) {
      positions.push(i);
      currentShift = goodSuffixTable[0];
      shiftReason = "Match found - shift by Good Suffix table[0]";
      i += goodSuffixTable[0];
    } else if (j >= 0 && step < currentStep) {
      // Shift according to the calculated rules
      const badCharShift = Math.max(1, j - badCharTable[sequence.charCodeAt(i + j)]);
      const goodSuffixShift = goodSuffixTable[j];
      i += Math.max(badCharShift, goodSuffixShift);
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
    shift: currentShift,
    shiftReason: shiftReason
  };
};