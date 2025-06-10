// DNA scoring matrices and utilities

// BLOSUM62-like scoring matrix for DNA
export const DNA_SCORING_MATRIX: Record<string, Record<string, number>> = {
  'A': { 'A': 2, 'T': -1, 'G': -1, 'C': -1, 'N': 0 },
  'T': { 'A': -1, 'T': 2, 'G': -1, 'C': -1, 'N': 0 },
  'G': { 'A': -1, 'T': -1, 'G': 2, 'C': -1, 'N': 0 },
  'C': { 'A': -1, 'T': -1, 'G': -1, 'C': 2, 'N': 0 },
  'N': { 'A': 0, 'T': 0, 'G': 0, 'C': 0, 'N': 0 }
};

// Ambiguous nucleotide definitions
export const AMBIGUOUS_NUCLEOTIDES: Record<string, string[]> = {
  'R': ['A', 'G'], // Purine
  'Y': ['C', 'T'], // Pyrimidine
  'S': ['G', 'C'], // Strong
  'W': ['A', 'T'], // Weak
  'K': ['G', 'T'], // Keto
  'M': ['A', 'C'], // Amino
  'B': ['C', 'G', 'T'], // Not A
  'D': ['A', 'G', 'T'], // Not C
  'H': ['A', 'C', 'T'], // Not G
  'V': ['A', 'C', 'G'], // Not T
  'N': ['A', 'C', 'G', 'T'] // Any
};

// Gap penalty schemes
export interface GapPenalty {
  open: number;
  extend: number;
}

export const GAP_PENALTIES = {
  DEFAULT: { open: -2, extend: -1 },
  STRICT: { open: -4, extend: -2 },
  LENIENT: { open: -1, extend: -0.5 }
};

// Calculate score for two nucleotides considering ambiguous bases
export function calculateNucleotideScore(n1: string, n2: string): number {
  // Handle ambiguous nucleotides
  if (n1 in AMBIGUOUS_NUCLEOTIDES && n2 in AMBIGUOUS_NUCLEOTIDES) {
    const bases1 = AMBIGUOUS_NUCLEOTIDES[n1];
    const bases2 = AMBIGUOUS_NUCLEOTIDES[n2];
    let maxScore = -Infinity;
    
    for (const b1 of bases1) {
      for (const b2 of bases2) {
        const score = DNA_SCORING_MATRIX[b1][b2];
        maxScore = Math.max(maxScore, score);
      }
    }
    return maxScore;
  }
  
  // Handle one ambiguous nucleotide
  if (n1 in AMBIGUOUS_NUCLEOTIDES) {
    const bases = AMBIGUOUS_NUCLEOTIDES[n1];
    return Math.max(...bases.map(b => DNA_SCORING_MATRIX[b][n2]));
  }
  if (n2 in AMBIGUOUS_NUCLEOTIDES) {
    const bases = AMBIGUOUS_NUCLEOTIDES[n2];
    return Math.max(...bases.map(b => DNA_SCORING_MATRIX[n1][b]));
  }
  
  // Handle regular nucleotides
  return DNA_SCORING_MATRIX[n1]?.[n2] ?? -1;
}

// Calculate alignment statistics
export interface AlignmentStats {
  identity: number;
  similarity: number;
  gaps: number;
  gapPercentage: number;
  length: number;
}

export function calculateAlignmentStats(
  alignedSeq1: string,
  alignedSeq2: string
): AlignmentStats {
  const length = alignedSeq1.length;
  let matches = 0;
  let similarities = 0;
  let gaps = 0;

  for (let i = 0; i < length; i++) {
    if (alignedSeq1[i] === alignedSeq2[i]) {
      matches++;
      similarities++;
    } else if (alignedSeq1[i] === '-' || alignedSeq2[i] === '-') {
      gaps++;
    } else {
      const score = calculateNucleotideScore(alignedSeq1[i], alignedSeq2[i]);
      if (score > 0) {
        similarities++;
      }
    }
  }

  return {
    identity: (matches / length) * 100,
    similarity: (similarities / length) * 100,
    gaps,
    gapPercentage: (gaps / length) * 100,
    length
  };
}

// Color coding for visualization
export function getNucleotideColor(nucleotide: string): string {
  switch (nucleotide.toUpperCase()) {
    case 'A':
      return '#FF0000'; // Red
    case 'T':
      return '#00FF00'; // Green
    case 'G':
      return '#0000FF'; // Blue
    case 'C':
      return '#FFFF00'; // Yellow
    case '-':
      return '#808080'; // Gray
    default:
      return '#FFFFFF'; // White for ambiguous
  }
} 