import { calculateNucleotideScore } from './dnaUtils';

export interface Mutation {
  type: 'point' | 'insertion' | 'deletion' | 'frameshift';
  position: number;
  original: string;
  mutated: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface MutationAnalysisResult {
  mutations: Mutation[];
  mutationRate: number;
  impactSummary: {
    high: number;
    medium: number;
    low: number;
  };
}

// BLOSUM62-like scoring matrix for amino acids
const AMINO_ACID_SCORES: Record<string, Record<string, number>> = {
  'A': { 'A': 4, 'R': -1, 'N': -2, 'D': -2, 'C': 0, 'Q': -1, 'E': -1, 'G': 0, 'H': -2, 'I': -1, 'L': -1, 'K': -1, 'M': -1, 'F': -2, 'P': -1, 'S': 1, 'T': 0, 'W': -3, 'Y': -2, 'V': 0 },
  // ... (other amino acids would be added here)
};

// Codon to amino acid mapping
const CODON_TO_AMINO: Record<string, string> = {
  'ATA': 'I', 'ATC': 'I', 'ATT': 'I', 'ATG': 'M',
  'ACA': 'T', 'ACC': 'T', 'ACG': 'T', 'ACT': 'T',
  'AAC': 'N', 'AAT': 'N', 'AAA': 'K', 'AAG': 'K',
  'AGC': 'S', 'AGT': 'S', 'AGA': 'R', 'AGG': 'R',
  'CTA': 'L', 'CTC': 'L', 'CTG': 'L', 'CTT': 'L',
  'CCA': 'P', 'CCC': 'P', 'CCG': 'P', 'CCT': 'P',
  'CAC': 'H', 'CAT': 'H', 'CAA': 'Q', 'CAG': 'Q',
  'CGA': 'R', 'CGC': 'R', 'CGG': 'R', 'CGT': 'R',
  'GTA': 'V', 'GTC': 'V', 'GTG': 'V', 'GTT': 'V',
  'GCA': 'A', 'GCC': 'A', 'GCG': 'A', 'GCT': 'A',
  'GAC': 'D', 'GAT': 'D', 'GAA': 'E', 'GAG': 'E',
  'GGA': 'G', 'GGC': 'G', 'GGG': 'G', 'GGT': 'G',
  'TCA': 'S', 'TCC': 'S', 'TCG': 'S', 'TCT': 'S',
  'TTC': 'F', 'TTT': 'F', 'TTA': 'L', 'TTG': 'L',
  'TAC': 'Y', 'TAT': 'Y', 'TAA': '*', 'TAG': '*',
  'TGC': 'C', 'TGT': 'C', 'TGA': '*', 'TGG': 'W'
};

export function analyzeMutations(originalSeq: string, mutatedSeq: string): MutationAnalysisResult {
  const mutations: Mutation[] = [];
  
  // If sequences are of different lengths, find where they start to differ
  if (originalSeq.length !== mutatedSeq.length) {
    // Find the first position where sequences differ
    let diffPosition = 0;
    while (diffPosition < Math.min(originalSeq.length, mutatedSeq.length) && 
           originalSeq[diffPosition] === mutatedSeq[diffPosition]) {
      diffPosition++;
    }

    // If they differ in length but are identical up to the shorter sequence's length
    if (diffPosition === Math.min(originalSeq.length, mutatedSeq.length)) {
      mutations.push({
        type: 'frameshift',
        position: diffPosition,
        original: originalSeq.substring(diffPosition),
        mutated: mutatedSeq.substring(diffPosition),
        impact: 'high',
        description: `Frameshift mutation at position ${diffPosition}: ${originalSeq.length > mutatedSeq.length ? 'deletion' : 'insertion'} of ${Math.abs(originalSeq.length - mutatedSeq.length)} nucleotides`
      });
    } else {
      // They differ at some position before the end
      mutations.push({
        type: 'frameshift',
        position: diffPosition,
        original: originalSeq.substring(diffPosition),
        mutated: mutatedSeq.substring(diffPosition),
        impact: 'high',
        description: `Frameshift mutation at position ${diffPosition}: sequences diverge with ${originalSeq.length > mutatedSeq.length ? 'deletion' : 'insertion'} of ${Math.abs(originalSeq.length - mutatedSeq.length)} nucleotides`
      });
    }
  } else {
    // Compare each position for point mutations
    for (let i = 0; i < originalSeq.length; i++) {
      if (originalSeq[i] !== mutatedSeq[i]) {
        mutations.push({
          type: 'point',
          position: i,
          original: originalSeq[i],
          mutated: mutatedSeq[i],
          impact: determineImpact(originalSeq[i], mutatedSeq[i]),
          description: `Point mutation from ${originalSeq[i]} to ${mutatedSeq[i]} at position ${i}`
        });
      }
    }
  }

  // Calculate mutation rate
  const mutationRate = mutations.length / Math.max(originalSeq.length, mutatedSeq.length);

  // Calculate impact summary
  const impactSummary = {
    high: mutations.filter(m => m.impact === 'high').length,
    medium: mutations.filter(m => m.impact === 'medium').length,
    low: mutations.filter(m => m.impact === 'low').length
  };

  return {
    mutations,
    mutationRate,
    impactSummary
  };
}

function findDeletionLength(original: string, mutated: string, i: number, j: number): number {
  let length = 0;
  while (i + length < original.length && 
         (j >= mutated.length || original[i + length] !== mutated[j])) {
    length++;
  }
  return length;
}

function findInsertionLength(original: string, mutated: string, i: number, j: number): number {
  let length = 0;
  while (j + length < mutated.length && 
         (i >= original.length || original[i] !== mutated[j + length])) {
    length++;
  }
  return length;
}

function determineImpact(original: string, mutated: string): 'high' | 'medium' | 'low' {
  // For point mutations
  if (original.length === 1 && mutated.length === 1) {
    const originalCodon = getCodon(original);
    const mutatedCodon = getCodon(mutated);
    const originalAmino = CODON_TO_AMINO[originalCodon] || 'X';
    const mutatedAmino = CODON_TO_AMINO[mutatedCodon] || 'X';
    
    if (originalAmino === mutatedAmino) return 'low';
    if (originalAmino === '*' || mutatedAmino === '*') return 'high';
    
    const score = AMINO_ACID_SCORES[originalAmino]?.[mutatedAmino] ?? -2;
    if (score > 0) return 'low';
    if (score > -2) return 'medium';
    return 'high';
  }

  // For insertions/deletions
  if (original.length !== mutated.length) {
    if (original.length % 3 === 0 && mutated.length % 3 === 0) return 'medium';
    return 'high';
  }

  return 'low';
}

function getCodon(nucleotide: string): string {
  // This is a simplified version - in reality, you'd need to consider the reading frame
  return nucleotide.repeat(3);
} 